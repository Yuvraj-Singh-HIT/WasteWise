'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyWasteAndGetConfidence } from '@/ai/flows/display-confidence-score';
import type { IdentifyWasteAndGetConfidenceOutput } from '@/ai/flows/display-confidence-score';
import { getWasteInfo, WasteInfo } from '@/lib/waste-data';
import { Progress } from '@/components/ui/progress';

export default function WasteIdentifierPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<
    (IdentifyWasteAndGetConfidenceOutput & { wasteInfo: WasteInfo & { type: string } }) | null
  >(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
        setResult(null); // Reset result when new image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!imageData) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please upload an image of the waste item.',
      });
      return;
    }

    setIsIdentifying(true);
    setResult(null);

    try {
      const identificationResult = await identifyWasteAndGetConfidence({ photoDataUri: imageData });
      const wasteInfo = getWasteInfo(identificationResult.wasteType);
      setResult({ ...identificationResult, wasteInfo });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: 'Could not identify the waste type. Please try again.',
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-12 md:grid-cols-2">
          <Card className="max-w-2xl mx-auto w-full">
            <CardHeader>
              <CardTitle>Waste Segregation Identifier</CardTitle>
              <CardDescription>
                Upload a photo of a waste item, and our AI will identify its type and tell you how to segregate it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>1. Upload Photo</Label>
                <div
                  className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={handleUploadClick}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Waste item preview" className="h-full w-full object-contain rounded-lg" />
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
              <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!imageData || isIdentifying}
              >
                {isIdentifying ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Identifying...
                    </>
                ) : 'Identify Waste Type'}
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            {isIdentifying && (
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <h2 className="text-2xl font-semibold">Analyzing Image...</h2>
                    <p className="text-muted-foreground">Our AI is hard at work identifying the waste material.</p>
                </div>
            )}
            {!isIdentifying && result && (
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-fit p-4 bg-muted rounded-full">
                            <result.wasteInfo.icon className={`h-12 w-12 ${result.wasteInfo.colorClass}`} />
                        </div>
                        <CardTitle className="text-3xl mt-4">It's {result.wasteInfo.type}!</CardTitle>
                        <CardDescription>Our AI is {(result.confidenceScore * 100).toFixed(0)}% confident.</CardDescription>
                        <Progress value={result.confidenceScore * 100} className="w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <div>
                            <h3 className="font-semibold text-lg">Description</h3>
                            <p className="text-muted-foreground">{result.wasteInfo.description}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg">How to Segregate</h3>
                            <p className="text-muted-foreground">{result.wasteInfo.segregation}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
             {!isIdentifying && !result && (
                <div className="text-center text-muted-foreground py-16 px-8 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">Awaiting Analysis</h3>
                    <p className="mt-2 text-sm">
                        Your analysis results will appear here once you upload and identify a waste item.
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
