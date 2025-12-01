'use client';

import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Search, Wrench, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// This matches the RecycledPart entity in backend.json
interface RecycledPart {
  id: string;
  name: string; // I'll assume the 'details' field from the schema can be used as 'name'
  price: number;
  photoUrl: string;
  // Other fields from your schema like deviceId, recyclingAgencyId, qrCode can be added here
}

export default function BrowsePartsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const recycledPartsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'recycled_parts') : null),
    [firestore]
  );

  const { data: recycledParts, isLoading } = useCollection<RecycledPart>(recycledPartsQuery);
  
  const handleBuyNow = (part: RecycledPart) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to purchase an item.',
      });
      return;
    }

    const partSalesCollectionRef = collection(firestore, 'part_sales');
    const commissionRate = 0.10; // 10% commission

    addDocumentNonBlocking(partSalesCollectionRef, {
      recycledPartId: part.id,
      buyerId: user.uid,
      saleDate: serverTimestamp(),
      salePrice: part.price,
      commissionAmount: part.price * commissionRate,
      deliveryPartnerId: null, // To be assigned later
      status: 'purchased'
    }).then(() => {
        toast({
            title: 'Purchase Successful!',
            description: `You have purchased the ${part.name}.`,
        });
        // Here you would typically also update the part's status to 'sold'
        // and initiate the delivery process.
    });
  }

  return (
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
                    <p className="text-primary font-bold text-xl">${part.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleBuyNow(part)} disabled={isUserLoading || !user}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
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
  );
}
