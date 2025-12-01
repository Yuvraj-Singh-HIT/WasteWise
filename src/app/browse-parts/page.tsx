'use client';

import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Search, Wrench, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { QRCode } from 'qrcode.react';

// This matches the RecycledPart entity in backend.json
interface RecycledPart {
  id: string;
  name: string; // I'll assume the 'details' field from the schema can be used as 'name'
  price: number;
  photoUrl: string;
  recyclingAgencyId: string;
}

// Simple GPay SVG icon component
const GPayIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9,10.19V13.81A2,2,0,0,1,12.87,15.8H12.9A2,2,0,0,1,14.86,13.81V10.19A2,2,0,0,0,12.9,8.2H12.87A2,2,0,0,0,10.9,10.19Z"
      fill="#5f6368"
    ></path>
    <path
      d="M9.91,12A2,2,0,0,1,8.2,10.19V10.16A2,2,0,0,1,9.88,8.2h0a2,2,0,0,1,1.71,1.91h2.23A4.2,4.2,0,0,0,9.91,6,4.2,4.2,0,0,0,5.7,10.17v.05A4.2,4.2,0,0,0,9.9,14.39a4.22,4.22,0,0,0,3.91-4.14H11.62A2,2,0,0,1,9.91,12Z"
      fill="#ea4335"
    ></path>
    <path
      d="M20.21,10.17v0A4.2,4.2,0,0,0,16.29,6a4.2,4.2,0,0,0-4,4.16H14a2,2,0,0,1,2-2,2,2,0,0,1,2,2,2,2,0,0,1-1.7,2H14.56v2.18h.27a2,2,0,0,0,2-2,2,2,0,0,0,1.94-2Z"
      fill="#fbbc05"
    ></path>
    <path
      d="M9.9,18a4.2,4.2,0,0,0,4-4.16H12.19a2,2,0,0,1-2,2,2,2,0,0,1-2-2,2,2,0,0,1,2-2h3.44a4.2,4.2,0,0,0-4,4.16v.05A4.2,4.2,0,0,0,9.9,18Z"
      fill="#4285f4"
    ></path>
    <path
      d="M9.91,6A4.2,4.2,0,0,0,6,9.88V10a2.12,2.12,0,0,0,.1.64A4.18,4.18,0,0,0,10.2,12a2,2,0,0,0,1.42-3.14A4.2,4.2,0,0,0,9.91,6Z"
      fill="#34a853"
    ></path>
  </svg>
);


export default function BrowsePartsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [selectedPart, setSelectedPart] = useState<RecycledPart | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const recycledPartsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'recycled_parts') : null),
    [firestore]
  );

  const { data: recycledParts, isLoading } = useCollection<RecycledPart>(recycledPartsQuery);
  
  const handleBuyNowClick = (part: RecycledPart) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to purchase an item.',
      });
      return;
    }
    setSelectedPart(part);
    setIsPaymentDialogOpen(true);
  }

  const handleConfirmPayment = () => {
    if (!user || !firestore || !selectedPart) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
      return;
    }

    const partSalesCollectionRef = collection(firestore, 'part_sales');
    const commissionRate = 0.10; // 10% commission

    addDocumentNonBlocking(partSalesCollectionRef, {
      recycledPartId: selectedPart.id,
      buyerId: user.uid,
      saleDate: serverTimestamp(),
      salePrice: selectedPart.price,
      commissionAmount: selectedPart.price * commissionRate,
      deliveryPartnerId: null, // To be assigned later
      status: 'purchased'
    }).then(() => {
        toast({
            title: 'Purchase Successful!',
            description: `${selectedPart.name} has been purchased.`,
        });
        setIsPaymentDialogOpen(false);
        setSelectedPart(null);
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Recycled Parts</h1>
            <p className="text-muted-foreground">Find genuine, tested parts to bring your devices back to life.</p>
          </div>
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for parts (e.g., iPhone 12 screen)"
              className="pl-10"
            />
          </div>
          
          {!isUserLoading && !user && (
               <Alert className="mb-8">
                  <ShoppingCart className="h-4 w-4" />
                  <AlertTitle>Ready to Buy?</AlertTitle>
                  <AlertDescription>
                      <Link href="/login" className="font-bold underline">Sign in or create an account</Link> to purchase parts.
                  </AlertDescription>
              </Alert>
          )}

          {isLoading && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <div className="w-full h-40 bg-muted animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && recycledParts && recycledParts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recycledParts.map((part) => (
                <Card key={part.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardContent className="p-0 flex-grow">
                     <div className="relative w-full h-40">
                      <Image
                          src={part.photoUrl}
                          alt={part.name}
                          fill
                          className="object-cover"
                       />
                     </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{part.name}</h3>
                      <p className="text-primary font-bold text-xl">₹{part.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button className="w-full" onClick={() => handleBuyNowClick(part)} disabled={isUserLoading || !user}>
                      <GPayIcon />
                      <span className="ml-2">Pay with GPay</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && (!recycledParts || recycledParts.length === 0) && (
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                  <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Parts Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                      There are currently no recycled parts listed for sale. Check back later!
                  </p>
              </div>
          )}
        </main>
      </div>

      {selectedPart && (
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Scan the QR code with your GPay app to pay ₹{selectedPart.price.toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center p-4 my-4 bg-white rounded-lg">
              <QRCode
                value={`upi://pay?pa=${selectedPart.recyclingAgencyId}@gpay&pn=WasteWise%20Seller&am=${selectedPart.price.toFixed(2)}&cu=INR&tn=Part:${selectedPart.name}`}
                size={256}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
