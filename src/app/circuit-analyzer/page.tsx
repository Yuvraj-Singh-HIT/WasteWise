'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Cpu } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCircuitBoard, AnalyzeCircuitBoardOutput } from '@/ai/flows/analyze-circuit-board';
import Image from 'next/image';

type Component = AnalyzeCircuitBoardOutput['components'][0];

export default function CircuitAnalyzerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeCircuitBoardOutput | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<Component | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setImagePreview(resultStr);
        setImageData(resultStr);
        setResult(null); 
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
        description: 'Please upload an image of the circuit board.',
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeCircuitBoard({ photoDataUri: imageData });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the circuit board. The model may be unable to process this image. Please try another.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Circuit Board Analyzer</h1>
            <p className="mt-2 text-lg text-muted-foreground">Upload a photo of a PCB, and our AI will identify and locate its key components.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-2 h-fit">
                <CardHeader>
                    <CardTitle>1. Upload Image</CardTitle>
                    <CardDescription>Select an image of a circuit board for analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={handleUploadClick}
                    >
                        {imagePreview ? (
                        <img src={imagePreview} alt="Circuit board preview" className="h-full w-full object-contain rounded-lg" />
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
                    <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!imageData || isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : 'Analyze Circuit Board'}
                    </Button>
                </CardContent>
            </Card>

            <div className="lg:col-span-3">
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle>2. Analysis Results</CardTitle>
                        <CardDescription>Identified components will be displayed here. Hover over the image or list for details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-[300px]">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                                <h2 className="text-2xl font-semibold">Running Analysis...</h2>
                                <p className="text-muted-foreground">Our AI is identifying components and their functions.</p>
                            </div>
                        )}

                        {!isAnalyzing && result && imagePreview && (
                            <div className="grid gap-6 @container">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                    <Image src={imagePreview} alt="Analyzed circuit board" layout="fill" objectFit="contain" />
                                    {result.components.map((component) => (
                                        <div
                                            key={component.componentName + component.boundingBox.x}
                                            className="absolute border-2 transition-all duration-200"
                                            style={{
                                                left: `${component.boundingBox.x}%`,
                                                top: `${component.boundingBox.y}%`,
                                                width: `${component.boundingBox.width}%`,
                                                height: `${component.boundingBox.height}%`,
                                                borderColor: hoveredComponent === component ? 'hsl(var(--primary))' : 'hsla(var(--primary), 0.5)',
                                                backgroundColor: hoveredComponent === component ? 'hsla(var(--primary), 0.2)' : 'hsla(var(--primary), 0.1)',
                                            }}
                                            onMouseEnter={() => setHoveredComponent(component)}
                                            onMouseLeave={() => setHoveredComponent(null)}
                                        >
                                            <span className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ opacity: hoveredComponent === component ? 1 : 0 }}
                                            >
                                                {component.componentName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-2">
                                     {result.components.map((component) => (
                                        <div
                                            key={component.componentName + component.boundingBox.x + 'list'}
                                            className={`p-2 rounded-lg border cursor-pointer transition-all ${hoveredComponent === component ? 'bg-muted shadow-md' : ''}`}
                                            onMouseEnter={() => setHoveredComponent(component)}
                                            onMouseLeave={() => setHoveredComponent(null)}
                                        >
                                            <p className="font-bold">{component.componentName}</p>
                                            <p className="text-sm text-muted-foreground">{component.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!isAnalyzing && !result && (
                            <div className="text-center text-muted-foreground py-16 px-8 border-2 border-dashed rounded-lg min-h-[300px] flex flex-col justify-center items-center">
                                <Cpu className="h-12 w-12 mb-4" />
                                <h3 className="text-lg font-semibold">Awaiting Analysis</h3>
                                <p className="mt-2 text-sm max-w-sm mx-auto">
                                    Upload an image of a Printed Circuit Board (PCB) and click "Analyze" to see the results.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
