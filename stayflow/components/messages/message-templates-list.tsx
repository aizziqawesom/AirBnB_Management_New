import Link from 'next/link';
import { Edit, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteTemplateButton } from './delete-template-button';
import { getTemplates } from '@/lib/actions/messages';
import type { MessageTemplate } from '@/lib/types/message';

const RECIPIENT_LABELS = {
  guest: 'Guest',
  cleaner: 'Cleaner',
  team: 'Team Member',
};

const RECIPIENT_COLORS = {
  guest: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  cleaner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  team: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

export async function MessageTemplatesList() {
  const result = await getTemplates();

  if (result.error || !result.data) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first message template.
        </p>
      </div>
    );
  }

  const templates = result.data as MessageTemplate[];

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No templates yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first message template.
        </p>
        <Button asChild className="mt-4">
          <Link href="/messages/new">Create Template</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1">{template.title}</CardTitle>
              <Badge className={RECIPIENT_COLORS[template.recipient]} variant="secondary">
                {RECIPIENT_LABELS[template.recipient]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
              {template.template}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/messages/${template.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteTemplateButton id={template.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
