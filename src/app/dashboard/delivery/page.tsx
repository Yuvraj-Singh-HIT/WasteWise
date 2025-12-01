'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, collectionGroup, serverTimestamp, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Truck } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

// This represents a device submitted by any user
interface DeviceSubmission {
    id: string;
    userId: string;
    uploadDate: { seconds: number, nanoseconds: number }; // Firestore timestamp
    photoUrl: string;
    deviceDetails: string;
    status?: 'pending' | 'collected' | 'collection-in-progress';
}

export default function DeliveryDashboardPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    const devicesQuery = useMemoFirebase(
        () => (firestore ? collectionGroup(firestore, 'devices') : null),
        [firestore]
    );

    const { data: deviceSubmissions, isLoading } = useCollection<DeviceSubmission>(devicesQuery);

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
        const serviceFee = 1.50; // Example service fee per transaction

        // 1. Create a new collection request
        const collectionRequestPromise = addDocumentNonBlocking(collectionRequestsRef, {
            deviceId: submission.id,
            userId: submission.userId,
            deliveryPartnerId: user.uid,
            requestDate: serverTimestamp(),
            status: 'accepted',
            paymentAmount: 20 // Placeholder payment amount
        });

        // 2. Update the device's status to 'collection-in-progress'
        updateDocumentNonBlocking(deviceRef, { status: 'collection-in-progress' });

        // 3. Log the service fee transaction for the delivery partner
        collectionRequestPromise.then(docRef => {
            if (docRef) {
                addDocumentNonBlocking(transactionsRef, {
                    deliveryPartnerId: user.uid,
                    transactionDate: serverTimestamp(),
                    transactionType: 'service fee',
                    amount: serviceFee,
                    collectionRequestId: docRef.id // Link transaction to the collection request
                });
            }
        });
        
        toast({
            title: 'Request Accepted',
            description: `You have been assigned to collect "${submission.deviceDetails}". A $${serviceFee.toFixed(2)} service fee has been applied.`,
        });
    };
    
    // Filter to only show devices that are pending collection
    const pendingSubmissions = deviceSubmissions?.filter(s => s.status === 'pending' || !s.status);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Partner Dashboard</CardTitle>
                        <CardDescription>View and manage pending device collection requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isUserLoading && !user && (
                             <Alert>
                                <Truck className="h-4 w-4" />
                                <AlertTitle>Become a Partner!</AlertTitle>
                                <AlertDescription>
                                    <Link href="/login" className="font-bold underline">Sign in or create an account</Link> to start accepting collection jobs.
                                </AlertDescription>
                            </Alert>
                        )}

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
                                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-10 w-28 ml-auto" /></TableCell>
                                    </TableRow>
                                ))}

                                {!isLoading && pendingSubmissions?.map((submission) => (
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
                         {!isLoading && (!pendingSubmissions || pendingSubmissions.length === 0) && (
                            <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Pending Requests</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are currently no devices submitted for collection. Check back soon!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
