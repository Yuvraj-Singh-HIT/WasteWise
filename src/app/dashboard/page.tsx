
'use client';

import Header from '@/components/header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building, Package, Smartphone, Truck } from 'lucide-react';
import Link from 'next/link';

const dashboardLinks = [
    {
        href: '/sell-device',
        title: 'My Devices',
        description: 'Track the status of devices you have submitted for collection.',
        icon: Smartphone,
    },
    {
        href: '/dashboard/delivery',
        title: 'Delivery Partner Hub',
        description: 'Manage device collections and part deliveries.',
        icon: Truck,
    },
    {
        href: '/dashboard/recycling',
        title: 'Recycling Agency Hub',
        description: 'List and manage salvaged parts on the marketplace.',
        icon: Building,
    },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Select a dashboard to view your activities.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardLinks.map((link) => (
            <Link href={link.href} key={link.href} className="block hover:no-underline">
              <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1.5">
                        <CardTitle>{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                    </div>
                    <link.icon className="h-8 w-8 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
