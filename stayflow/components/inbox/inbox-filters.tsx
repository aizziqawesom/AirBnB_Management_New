'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { InboxFilters } from '@/lib/types/inbox';
import type { MessageStatus } from '@/lib/types/sent-message';

interface InboxFiltersProps {
  properties: Array<{ id: string; name: string }>;
  onFiltersChange: (filters: InboxFilters) => void;
}

export function InboxFilters({ properties, onFiltersChange }: InboxFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<InboxFilters>({});

  const updateFilter = (key: keyof InboxFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value as any;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {Object.keys(filters).length}
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property</label>
                <Select
                  value={filters.property_id || ''}
                  onValueChange={(value) =>
                    updateFilter('property_id', value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All properties</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) =>
                    updateFilter('status', value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select
                  value={
                    filters.date_from
                      ? `${filters.date_from}_${filters.date_to}`
                      : ''
                  }
                  onValueChange={(value) => {
                    if (!value) {
                      updateFilter('date_from', undefined);
                      updateFilter('date_to', undefined);
                    } else {
                      const [from, to] = value.split('_');
                      updateFilter('date_from', from);
                      updateFilter('date_to', to);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All time</SelectItem>
                    <SelectItem
                      value={`${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}_${new Date().toISOString()}`}
                    >
                      Last 7 days
                    </SelectItem>
                    <SelectItem
                      value={`${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}_${new Date().toISOString()}`}
                    >
                      Last 30 days
                    </SelectItem>
                    <SelectItem
                      value={`${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()}_${new Date().toISOString()}`}
                    >
                      Last 90 days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
