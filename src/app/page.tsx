'use client';
import Image from 'next/image';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Recycle, Smartphone, Truck, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'recycled-products');

  const steps = [
    {
      icon: Smartphone,
      title: 'Upload Your Device',
      description: 'Snap a photo of your broken phone. Our system will log the details for collection.',
    },
    {
      icon: Truck,
      title: 'Easy Collection',
      description: 'A delivery partner will collect the device from you and you get paid on the spot.',
    },
    {
      icon: Wrench,
      title: 'Expert Recycling',
      description: 'Our partner agencies dismantle the device, salvage reusable parts, and tag them with a QR code.',
    },
    {
      icon: Recycle,
      title: 'Shop & Revive',
      description: 'Browse our marketplace for genuine, recycled parts to give another device a new life.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 bg-secondary/30">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Recycled phone parts neatly organized"
              fill
              className="object-cover opacity-20"
              data-ai-hint="recycled products"
            />
          )}
          <div className="container mx-auto px-4 relative">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">Turning yesterday’s waste into tomorrow’s resources</h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Waste isn’t the end — it’s the beginning of something useful
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" onClick={() => router.push('/sell-device')}>Sell My Device</Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/browse-parts')}>Browse Parts</Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">A Simple, Transparent Process</h2>
              <p className="mt-2 text-lg text-muted-foreground">From broken device to valuable part in four easy steps.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Model Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Business Model</h2>
              <p className="mt-2 text-lg text-muted-foreground">A win-win model for users, partners, and the planet.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Commission on Part Sales</CardTitle>
                  <CardDescription>We take a small commission (5-15%) from each part sold, ensuring a fair price for both buyer and seller.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                      <span>Funds new platform features and growth.</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                      <span>Keeps the marketplace running smoothly and securely.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Partner Fees</CardTitle>
                  <CardDescription>Our delivery partners pay a small service charge per transaction or a monthly subscription.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                      <span>Provides partners with a steady stream of collection and delivery jobs.</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                      <span>Ensures a reliable and professional logistics network for our users.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} WasteWise. All rights reserved.</p>
           <p className="inline-flex items-center gap-1 mt-1">
            Giving technology a second chance.
          </p>
        </div>
      </footer>
    </div>
  );
}
