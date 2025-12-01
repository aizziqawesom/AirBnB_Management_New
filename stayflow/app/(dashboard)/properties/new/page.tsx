import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyForm } from '@/components/properties/property-form';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/properties">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground">
          Create a new property listing for your portfolio
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
