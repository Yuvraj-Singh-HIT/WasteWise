'use client';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function DeliveryDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Feature Under Maintenance</CardTitle>
            <CardDescription>The Delivery Partner Dashboard is temporarily unavailable.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Wrench className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              We are working to resolve an issue with this feature. Please check back later.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
