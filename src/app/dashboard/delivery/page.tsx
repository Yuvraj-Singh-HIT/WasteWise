'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Truck } from 'lucide-react';
import Image from 'next/image';

// This represents a device submitted by any user
interface DeviceSubmission {
    id: string;
    userId: string;
    uploadDate: { seconds: number, nanoseconds: number }; // Firestore timestamp
    photoUrl: string;
    deviceDetails: string;
    status?: 'pending' | 'collected';
}

export default function DeliveryDashboardPage() {
    const firestore = useFirestore();

    const devicesQuery = useMemoFirebase(
        () => (firestore ? collectionGroup(firestore, 'devices') : null),
        [firestore]
    );

    const { data: deviceSubmissions, isLoading } = useCollection<DeviceSubmission>(devicesQuery);

    const handleAcceptRequest = (submission: DeviceSubmission) => {
        // Placeholder for future functionality
        alert(`Request for device "${submission.deviceDetails}" accepted!`);
        // In the future, this will update the document status to 'collected'
        // and assign it to the current delivery partner.
    };

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

                                {!isLoading && deviceSubmissions?.map((submission) => (
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
                                                disabled={submission.status === 'collected'}
                                            >
                                                Accept Request
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {!isLoading && (!deviceSubmissions || deviceSubmissions.length === 0) && (
                            <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Pending Requests</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are currently no devices submitted for collection.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
