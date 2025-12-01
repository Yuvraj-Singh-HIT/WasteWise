'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, LogIn, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RecyclingAgencyDashboard() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [partDetails, setPartDetails] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!user || !firestore || !imageData || !price) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'You must be logged in, provide an image, and set a price.',
      });
      return;
    }

    setIsSubmitting(true);

    // This assumes the user.uid is the ID for the recycling agency
    const recycledPartsCollectionRef = collection(firestore, 'recycled_parts');
    
    // In a real app, you would upload the image to Firebase Storage and get a URL.
    // For now, we store the base64 data URI directly.
    addDocumentNonBlocking(recycledPartsCollectionRef, {
      recyclingAgencyId: user.uid,
      uploadDate: serverTimestamp(),
      photoUrl: imageData,
      name: partDetails, // using name to align with browse-parts page
      details: partDetails,
      price: parseFloat(price),
      qrCode: `QR_CODE_FOR_${Date.now()}` // Placeholder QR code
    }).then(() => {
        toast({
            title: 'Part Listed!',
            description: 'The recycled part is now available on the marketplace.',
        });
        setImagePreview(null);
        setImageData(null);
        setPartDetails('');
        setPrice('');
    }).finally(() => {
        setIsSubmitting(false);
    });
  };

  const isFormValid = imageData && partDetails && price && user;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Recycling Agency Dashboard</CardTitle>
            <CardDescription>
              Upload salvaged parts to list them on the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isUserLoading && !user && (
                 <Alert>
                    <LogIn className="h-4 w-4" />
                    <AlertTitle>You're not signed in!</AlertTitle>
                    <AlertDescription>
                        Please <Link href="/login" className="font-bold underline">sign in with an agency account</Link> to list parts.
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-2">
              <Label>1. Upload Part Photo</Label>
              <div
                className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={handleUploadClick}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Part preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Camera className="mx-auto h-12 w-12" />
                    <p>Click to upload a photo</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                disabled={!user}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partDetails">2. Add Part Details</Label>
              <Textarea
                id="partDetails"
                placeholder="e.g., iPhone 12 Pro Screen Assembly, Grade A"
                rows={3}
                value={partDetails}
                onChange={(e) => setPartDetails(e.target.value)}
                disabled={!user}
              />
            </div>
             <div className="space-y-2">
                <Label htmlFor="price">3. Set Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1500"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={!user}
                />
              </div>

            <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting || isUserLoading}
            >
              {isSubmitting ? 'Listing Part...' : 'List Part for Sale'}
              <Upload className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
