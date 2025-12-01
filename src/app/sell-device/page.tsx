'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SellDevicePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState('');
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
    if (!user || !firestore || !imageData) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'You must be logged in and provide an image.',
      });
      return;
    }

    setIsSubmitting(true);

    const devicesCollectionRef = collection(firestore, `users/${user.uid}/devices`);
    
    // For now, we will save the base64 data URI directly.
    // In a real-world scenario, you'd upload this to Firebase Storage and save the URL.
    addDocumentNonBlocking(devicesCollectionRef, {
      userId: user.uid,
      uploadDate: serverTimestamp(),
      photoUrl: imageData, // Using the base64 data URI as a placeholder
      deviceDetails: deviceDetails,
    }).then(() => {
        toast({
            title: 'Device Submitted!',
            description: 'A delivery partner will be in touch soon.',
        });
        setImagePreview(null);
        setImageData(null);
        setDeviceDetails('');
    }).finally(() => {
        setIsSubmitting(false);
    });

  };

  const isFormValid = imageData && deviceDetails && user;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Sell Your Device</CardTitle>
            <CardDescription>
              Follow the steps to list your broken or used device for collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isUserLoading && !user && (
                 <Alert>
                    <LogIn className="h-4 w-4" />
                    <AlertTitle>You're not signed in!</AlertTitle>
                    <AlertDescription>
                        Please <Link href="/login" className="font-bold underline">sign in or create an account</Link> to sell a device.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
              <Label>1. Upload a Photo</Label>
              <div
                className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={handleUploadClick}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Device preview" className="h-full w-full object-contain rounded-lg" />
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
              <Label htmlFor="deviceDetails">2. Add Device Details</Label>
              <Textarea
                id="deviceDetails"
                placeholder="e.g., iPhone 12, cracked screen, does not power on..."
                rows={4}
                value={deviceDetails}
                onChange={(e) => setDeviceDetails(e.target.value)}
                disabled={!user}
              />
            </div>
            <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting || isUserLoading}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Collection'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
