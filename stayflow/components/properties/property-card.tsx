'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import type { Property } from '@/lib/types/property';
import { deleteProperty } from '@/lib/actions/properties';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
}

const statusColors = {
  available: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
  maintenance: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20',
  unavailable: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20',
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${property.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProperty(property.id);

    if (result.error) {
      toast.error('Error', {
        description: result.error,
      });
      setIsDeleting(false);
    } else {
      toast.success('Success', {
        description: 'Property deleted successfully',
      });
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{property.name}</CardTitle>
          <Badge variant="outline" className={statusColors[property.status]}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{property.type || 'N/A'}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{property.capacity} {property.capacity === 1 ? 'guest' : 'guests'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-primary">
              RM {property.price_per_night.toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/properties/${property.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
