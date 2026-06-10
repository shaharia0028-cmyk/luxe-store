import { Search, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="relative mx-auto mb-8 w-32 h-32">
          <Package className="w-32 h-32 text-muted absolute" />
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-orange">
            404
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-orange hover:bg-orange-600">
            <Link href="/">
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
