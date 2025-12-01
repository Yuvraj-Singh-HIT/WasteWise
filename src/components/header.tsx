import { Button } from '@/components/ui/button';
import { Recycle, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Recycle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground tracking-tight">
            WasteWise
          </h1>
        </div>
        <Button variant="outline" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Login</span>
        </Button>
      </div>
    </header>
  );
}
