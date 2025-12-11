'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LEGEND_ITEMS = [
  { color: 'bg-blue-500', label: 'Confirmed / Checked In' },
  { color: 'bg-yellow-500', label: 'Pending' },
  { color: 'bg-green-500', label: 'Completed / Checked Out' },
  { color: 'bg-gray-400', label: 'Cancelled / No Show' },
];

export function CalendarLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEGEND_ITEMS.map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
