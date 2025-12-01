import Header from '@/components/header';
import WasteAnalyzer from '@/components/waste-analyzer';
import EducationalContent from '@/components/educational-content';
import { Recycle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <WasteAnalyzer />
        <EducationalContent />
      </main>
      <footer className="py-6 mt-12 border-t">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} WasteWise. All rights reserved.</p>
          <p className="inline-flex items-center gap-1 mt-1">
            Made with <Recycle className="h-4 w-4 text-primary" /> for a cleaner planet.
          </p>
        </div>
      </footer>
    </div>
  );
}
