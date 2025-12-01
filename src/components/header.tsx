import { Button } from '@/components/ui/button';
import { Recycle, User, Truck } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Recycle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground tracking-tight">
            WasteWise
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
           <Link href="/dashboard/delivery">
            <Button variant="ghost" size="sm" asChild>
                <div>
                    <Truck className="h-5 w-5" />
                    <span className="hidden sm:inline-block ml-2">Partner Dashboard</span>
                </div>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="icon" asChild>
              <div>
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </div>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
