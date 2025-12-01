'use client';

import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock data for recycled parts
const recycledParts = [
  { id: 1, name: 'iPhone 11 Screen', price: 45.99, imageUrl: 'https://picsum.photos/seed/part1/300/200' },
  { id: 2, name: 'Samsung S20 Battery', price: 25.00, imageUrl: 'https://picsum.photos/seed/part2/300/200' },
  { id: 3, name: 'Pixel 4a Camera Module', price: 35.50, imageUrl: 'https://picsum.photos/seed/part3/300/200' },
  { id: 4, name: 'OnePlus 7T Charging Port', price: 18.75, imageUrl: 'https://picsum.photos/seed/part4/300/200' },
  { id: 5, name: 'iPhone X Logic Board', price: 89.99, imageUrl: 'https://picsum.photos/seed/part5/300/200' },
  { id: 6, name: 'Galaxy Note 10 S-Pen', price: 22.00, imageUrl: 'https://picsum.photos/seed/part6/300/200' },
];

export default function BrowsePartsPage() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recycledParts.map((part) => (
            <Card key={part.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <img src={part.imageUrl} alt={part.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{part.name}</h3>
                  <p className="text-primary font-bold text-xl">${part.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
