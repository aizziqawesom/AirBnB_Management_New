'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createTemplate } from '@/lib/actions/messages';
import { TEMPLATE_VARIABLES, SAMPLE_DATA, type MessageRecipient } from '@/lib/types/message';

export default function NewMessageTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState<MessageRecipient>('guest');
  const [template, setTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate preview by replacing variables with sample data
  const generatePreview = () => {
    let preview = template;
    const sampleData = SAMPLE_DATA[recipient];

    Object.entries(sampleData).forEach(([key, value]) => {
      const variable = `{{${key}}}`;
      preview = preview.replace(new RegExp(variable, 'g'), value);
    });

    return preview;
  };

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + variable + text.substring(end);
    setTemplate(newText);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTemplate({
        title,
        recipient,
        template,
      });

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Message template created successfully',
        });
        router.push('/messages');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = template.length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Message Template</h1>
          <p className="text-muted-foreground">
            Create a reusable message template for your team
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>
              Basic information about your message template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Welcome Message, Check-in Instructions"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">
                Recipient Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={recipient}
                onValueChange={(value) => setRecipient(value as MessageRecipient)}
              >
                <SelectTrigger id="recipient">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="cleaner">Cleaner</SelectItem>
                  <SelectItem value="team">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Template</CardTitle>
            <CardDescription>
              Write your message template. Click on variables below to insert them at cursor position.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="template">
                  Template Content <span className="text-destructive">*</span>
                </Label>
                <span className="text-sm text-muted-foreground">
                  {characterCount} characters
                </span>
              </div>
              <Textarea
                id="template"
                ref={textareaRef}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Enter your message template here..."
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Available Variables</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Click to insert at cursor position
              </p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_VARIABLES[recipient].map((variable) => (
                  <Button
                    key={variable.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.value)}
                  >
                    {variable.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              See how your message will look with sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {template ? generatePreview() : (
                <span className="text-muted-foreground italic">
                  Preview will appear here as you type...
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
}
