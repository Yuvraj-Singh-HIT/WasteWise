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
import { Truck, Package } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DeviceSubmission {
    id: string;
    userId: string;
    uploadDate: { seconds: number, nanoseconds: number };
    photoUrl: string;
    deviceDetails: string;
    status?: 'pending' | 'collected' | 'collection-in-progress';
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

    // Query for device collections
    const devicesQuery = useMemoFirebase(
        () => (firestore ? collectionGroup(firestore, 'devices') : null),
        [firestore]
    );
    const { data: deviceSubmissions, isLoading: isLoadingDevices } = useCollection<DeviceSubmission>(devicesQuery);

    // Query for part deliveries
    const partSalesQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'part_sales'), where('status', '==', 'purchased')) : null),
        [firestore]
    );
    const { data: partSales, isLoading: isLoadingSales } = useCollection<PartSale>(partSalesQuery);


    const handleAcceptRequest = (submission: DeviceSubmission) => {
        if (!user || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to accept requests.',
            });
            return;
        }

        const deviceRef = doc(firestore, `users/${submission.userId}/devices/${submission.id}`);
        const collectionRequestsRef = collection(firestore, 'collection_requests');
        const transactionsRef = collection(firestore, 'delivery_partner_transactions');
        const serviceFee = 50.00;

        const collectionRequestPromise = addDocumentNonBlocking(collectionRequestsRef, {
            deviceId: submission.id,
            userId: submission.userId,
            deliveryPartnerId: user.uid,
            requestDate: serverTimestamp(),
            status: 'accepted',
            paymentAmount: 500
        });

        updateDocumentNonBlocking(deviceRef, { status: 'collection-in-progress' });

        collectionRequestPromise.then(docRef => {
            if (docRef) {
                addDocumentNonBlocking(transactionsRef, {
                    deliveryPartnerId: user.uid,
                    transactionDate: serverTimestamp(),
                    transactionType: 'service fee',
                    amount: serviceFee,
                    collectionRequestId: docRef.id
                });
            }
        });
        
        toast({
            title: 'Request Accepted',
            description: `You have been assigned to collect "${submission.deviceDetails}". A ₹${serviceFee.toFixed(2)} service fee has been applied.`,
        });
    };

    const handleAcceptDelivery = (sale: PartSale) => {
        if (!user || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to accept deliveries.',
            });
            return;
        }

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
    
    const pendingSubmissions = deviceSubmissions?.filter(s => s.status === 'pending' || !s.status);

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
                                    <Link href="/login" className="font-bold underline">Sign in or create an account</Link> to start accepting collection and delivery jobs.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <Tabs defaultValue="collections">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="collections">Device Collections</TabsTrigger>
                                <TabsTrigger value="deliveries">Part Deliveries</TabsTrigger>
                            </TabsList>
                            <TabsContent value="collections">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Date Submitted</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingDevices && Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={`load-coll-${i}`}>
                                                <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-10 w-28 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}

                                        {!isLoadingDevices && pendingSubmissions?.map((submission) => (
                                            <TableRow key={submission.id}>
                                                <TableCell>
                                                    <Image src={submission.photoUrl} alt="Device" width={64} height={64} className="rounded-md object-cover" />
                                                </TableCell>
                                                <TableCell className="font-medium">{submission.deviceDetails}</TableCell>
                                                <TableCell>{new Date(submission.uploadDate.seconds * 1000).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={submission.status === 'collected' ? 'default' : 'secondary'}>
                                                        {submission.status || 'pending'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        onClick={() => handleAcceptRequest(submission)}
                                                        disabled={isUserLoading || !user || submission.status === 'collection-in-progress'}
                                                    >
                                                        {submission.status === 'collection-in-progress' ? 'Accepted' : 'Accept Request'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                 {!isLoadingDevices && (!pendingSubmissions || pendingSubmissions.length === 0) && (
                                    <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                        <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No Pending Collection Requests</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            There are currently no devices submitted for collection. Check back soon!
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="deliveries">
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Part ID</TableHead>
                                            <TableHead>Buyer ID</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingSales && Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={`load-del-${i}`}>
                                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-10 w-36 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}

                                        {!isLoadingSales && partSales?.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="font-mono text-xs">{sale.recycledPartId}</TableCell>
                                                <TableCell className="font-mono text-xs">{sale.buyerId}</TableCell>
                                                <TableCell className="font-medium">₹{sale.salePrice.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {sale.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        onClick={() => handleAcceptDelivery(sale)}
                                                        disabled={isUserLoading || !user}
                                                    >
                                                        Accept for Delivery
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                 {!isLoadingSales && (!partSales || partSales.length === 0) && (
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
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
