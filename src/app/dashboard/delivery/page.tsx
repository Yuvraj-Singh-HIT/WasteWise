
'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, collectionGroup, serverTimestamp, doc, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Truck, Package, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';


interface DeviceSubmission {
    id: string;
    userId: string;
    uploadDate: { seconds: number, nanoseconds: number };
    photoUrl: string;
    deviceDetails: string;
    status?: 'pending' | 'collected' | 'collection-in-progress';
}

interface CollectionRequest {
    id: string;
    deviceId: string;
    userId: string;
    deliveryPartnerId: string;
    status: 'accepted' | 'collected';
    device?: DeviceSubmission; // Enriched data
}

interface PartSale {
    id: string;
    recycledPartId: string;
    buyerId: string;
    saleDate: { seconds: number, nanoseconds: number };
    salePrice: number;
    status: 'purchased' | 'out-for-delivery' | 'delivered';
}

export default function DeliveryDashboardPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    // --- QUERIES ---
    
    // 1. Get all pending device submissions for the "Available Collections" tab
    const allDevicesQuery = useMemoFirebase(
        () => (firestore ? query(collectionGroup(firestore, 'devices'), where('status', '==', 'pending')) : null),
        [firestore]
    );
    const { data: allPendingDevices, isLoading: isLoadingAllDevices } = useCollection<DeviceSubmission>(allDevicesQuery);

    // 2. Get collection requests assigned to the current delivery partner
    const myCollectionsQuery = useMemoFirebase(
        () => (firestore && user?.uid ? query(collection(firestore, 'collection_requests'), where('deliveryPartnerId', '==', user.uid)) : null),
        [firestore, user?.uid]
    );
    const { data: myCollectionRequests, isLoading: isLoadingMyCollections } = useCollection<CollectionRequest>(myCollectionsQuery);
    
    // 3. Get all devices to enrich "My Collections" with device details
    const allDevicesForEnrichmentQuery = useMemoFirebase(
        () => (firestore ? collectionGroup(firestore, 'devices') : null),
        [firestore]
    );
    const { data: allDevicesForEnrichment, isLoading: isLoadingAllDevicesForEnrichment } = useCollection<DeviceSubmission>(allDevicesForEnrichmentQuery);
    
    // 4. Get all purchased parts for the "Available Deliveries" tab
    const partSalesQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'part_sales'), where('status', '==', 'purchased')) : null),
        [firestore]
    );
    const { data: availablePartSales, isLoading: isLoadingSales } = useCollection<PartSale>(partSalesQuery);

    // --- DATA PROCESSING ---

    const enrichedMyCollections = React.useMemo(() => {
        if (!myCollectionRequests || !allDevicesForEnrichment) return [];
        return myCollectionRequests
            .map(req => ({
                ...req,
                device: allDevicesForEnrichment.find(d => d.id === req.deviceId)
            }))
            .filter(req => req.device); // Ensure device info exists
    }, [myCollectionRequests, allDevicesForEnrichment]);


    const isLoading = isUserLoading || isLoadingAllDevices || isLoadingMyCollections || isLoadingAllDevicesForEnrichment || isLoadingSales;

    // --- HANDLERS ---
    const handleAcceptCollectionRequest = (submission: DeviceSubmission) => {
        if (!user || !firestore) return;

        const deviceRef = doc(firestore, `users/${submission.userId}/devices/${submission.id}`);
        const collectionRequestsRef = collection(firestore, 'collection_requests');
        
        // Optimistically create the collection request
        addDocumentNonBlocking(collectionRequestsRef, {
            deviceId: submission.id,
            userId: submission.userId,
            deliveryPartnerId: user.uid,
            requestDate: serverTimestamp(),
            status: 'accepted',
            paymentAmount: 500, // Placeholder amount
        });

        // Optimistically update device status
        updateDocumentNonBlocking(deviceRef, { status: 'collection-in-progress' });
        
        toast({
            title: 'Request Accepted',
            description: `You have been assigned to collect "${submission.deviceDetails}".`,
        });
    };
    
    const handleMarkAsCollected = (request: CollectionRequest) => {
        if (!user || !firestore || !request.device) return;

        const deviceRef = doc(firestore, `users/${request.userId}/devices/${request.deviceId}`);
        const collectionRequestRef = doc(firestore, 'collection_requests', request.id);

        updateDocumentNonBlocking(deviceRef, { status: 'collected' });
        updateDocumentNonBlocking(collectionRequestRef, { status: 'collected' });

        toast({
            title: 'Collection Complete',
            description: `Device "${request.device.deviceDetails}" has been marked as collected.`,
        });
    }

    const handleAcceptDelivery = (sale: PartSale) => {
        if (!user || !firestore) return;

        const saleRef = doc(firestore, `part_sales/${sale.id}`);
        updateDocumentNonBlocking(saleRef, { 
            deliveryPartnerId: user.uid,
            status: 'out-for-delivery' 
        });

        toast({
            title: 'Delivery Accepted',
            description: `You have been assigned to deliver part ${sale.recycledPartId}.`,
        });
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Partner Dashboard</CardTitle>
                        <CardDescription>View and manage device collections and part deliveries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {!isUserLoading && !user && (
                             <Alert>
                                <Truck className="h-4 w-4" />
                                <AlertTitle>Become a Partner!</AlertTitle>
                                <AlertDescription>
                                    <Link href="/login" className="font-bold underline">Sign in or create an account</Link> to start accepting jobs.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        { user && (
                        <Tabs defaultValue="my-collections">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="my-collections">My Collections</TabsTrigger>
                                <TabsTrigger value="available-collections">Available Collections</TabsTrigger>
                                <TabsTrigger value="available-deliveries">Available Deliveries</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="my-collections">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading && Array.from({ length: 2 }).map((_, i) => (
                                            <TableRow key={`load-my-coll-${i}`}>
                                                <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-10 w-36 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}
                                        {!isLoading && enrichedMyCollections?.filter(r => r.status === 'accepted').map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>
                                                    {request.device && <Image src={request.device.photoUrl} alt="Device" width={64} height={64} className="rounded-md object-cover" />}
                                                </TableCell>
                                                <TableCell className="font-medium">{request.device?.deviceDetails}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{request.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                     <Button onClick={() => handleMarkAsCollected(request)} >
                                                        <PackageCheck className="mr-2 h-4 w-4" />
                                                        Mark as Collected
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                 {!isLoading && (!enrichedMyCollections || enrichedMyCollections.filter(r => r.status === 'accepted').length === 0) && (
                                    <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                        <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No Active Collections</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Accept a job from the "Available Collections" tab.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="available-collections">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Date Submitted</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={`load-coll-${i}`}>
                                                <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-10 w-28 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}
                                        {!isLoading && allPendingDevices?.map((submission) => (
                                            <TableRow key={submission.id}>
                                                <TableCell>
                                                    <Image src={submission.photoUrl} alt="Device" width={64} height={64} className="rounded-md object-cover" />
                                                </TableCell>
                                                <TableCell className="font-medium">{submission.deviceDetails}</TableCell>
                                                <TableCell>{new Date(submission.uploadDate.seconds * 1000).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button onClick={() => handleAcceptCollectionRequest(submission)}>
                                                        Accept Request
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                 {!isLoading && (!allPendingDevices || allPendingDevices.length === 0) && (
                                    <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                        <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No Pending Collection Requests</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            There are currently no devices submitted for collection. Check back soon!
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="available-deliveries">
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Part ID</TableHead>
                                            <TableHead>Buyer ID</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={`load-del-${i}`}>
                                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-10 w-36 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}

                                        {!isLoading && availablePartSales?.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="font-mono text-xs">{sale.recycledPartId}</TableCell>
                                                <TableCell className="font-mono text-xs">{sale.buyerId}</TableCell>
                                                <TableCell className="font-medium">₹{sale.salePrice.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button onClick={() => handleAcceptDelivery(sale)}>
                                                        Accept for Delivery
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                 {!isLoading && (!availablePartSales || availablePartSales.length === 0) && (
                                    <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No Pending Deliveries</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            There are currently no purchased parts awaiting delivery.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
 