"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { identifyWasteAndGetConfidence, type IdentifyWasteAndGetConfidenceOutput } from '@/ai/flows/display-confidence-score';
import { useToast } from "@/hooks/use-toast";
import { getWasteInfo, type WasteInfo } from '@/lib/waste-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, WandSparkles, Loader2, Info } from 'lucide-react';

type ResultState = (IdentifyWasteAndGetConfidenceOutput & { wasteInfo: WasteInfo & { type: string } });

export default function WasteAnalyzer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Genkit media
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      resetState();
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (!imagePreview) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const analysisResult = await identifyWasteAndGetConfidence({ photoDataUri: imagePreview });
        if (!analysisResult?.wasteType) {
            throw new Error('Analysis returned no result.');
        }
        const wasteInfo = getWasteInfo(analysisResult.wasteType);
        setResult({ ...analysisResult, wasteInfo });
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          title: "Analysis Failed",
          description: "We couldn't identify the item. Please try a different image or angle.",
          variant: "destructive",
        });
      }
    });
  };

  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
  };
  
  const confidenceLevel = result ? Math.round(result.confidenceScore * 100) : 0;
  const WasteIcon = result ? result.wasteInfo.icon : null;
  
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Identify Waste in Seconds</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a photo of a waste item, and our AI will identify it and guide you on proper disposal.
        </p>
      </div>

      <Card className="max-w-5xl mx-auto shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-6 flex flex-col items-center justify-center bg-secondary/30 border-b md:border-b-0 md:border-r">
            {!imagePreview && (
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
                </div>
                <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
              </label>
            )}

            {imagePreview && (
              <div className="relative w-full max-w-sm aspect-square">
                <Image src={imagePreview} alt="Waste item" fill className="object-cover rounded-lg" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8 z-10" onClick={resetState}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button size="lg" className="mt-6 w-full max-w-sm" onClick={handleAnalyzeClick} disabled={!imagePreview || isPending}>
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <WandSparkles className="mr-2 h-5 w-5" />}
              Analyze Waste
            </Button>
          </div>

          <div className="p-6 flex flex-col justify-center min-h-[350px]">
            {!result && !isPending && (
                <div className="text-center text-muted-foreground">
                    <Info className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">Awaiting Analysis</h3>
                    <p>Your analysis results will appear here.</p>
                </div>
            )}
            {isPending && (
                 <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">Analyzing...</h3>
                    <p>Our AI is inspecting your item. This may take a moment.</p>
                </div>
            )}
            {result && WasteIcon && (
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="items-center text-center">
                  <WasteIcon className={cn("h-12 w-12", result.wasteInfo.colorClass)} />
                  <CardTitle className={cn("text-3xl font-bold pt-2", result.wasteInfo.colorClass)}>{result.wasteInfo.type}</CardTitle>
                  <CardDescription className="text-base">{result.wasteInfo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium text-muted-foreground">AI Confidence</span>
                      <span className="font-bold">{confidenceLevel}%</span>
                    </div>
                    <Progress value={confidenceLevel} className="h-2" />
                  </div>
                  <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
                     <h4 className="font-semibold">Segregation Guide</h4>
                     <p className="text-muted-foreground">{result.wasteInfo.segregation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </section>
  )
}
