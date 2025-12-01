'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';
import React, { useState } from 'react';

export default function SellDevicePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceDetails">2. Add Device Details</Label>
              <Textarea
                id="deviceDetails"
                placeholder="e.g., iPhone 12, cracked screen, does not power on..."
                rows={4}
              />
            </div>
            <Button className="w-full" size="lg">
              Submit for Collection
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
