import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/services/properties';
import { PropertyForm } from '@/components/properties/property-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>

      <PropertyForm
        mode="edit"
        propertyId={property.id}
        initialValues={{
          name: property.name,
          type: property.type,
          capacity: property.capacity,
          price_per_night: property.price_per_night,
          amenities: property.amenities,
          status: property.status,
        }}
      />
    </div>
  );
}
