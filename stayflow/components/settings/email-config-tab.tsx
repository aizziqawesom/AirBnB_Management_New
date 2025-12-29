'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import type { EmailSettings } from '@/lib/types/email-settings';

export function EmailConfigTab() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [senderName, setSenderName] = useState('StayFlow');
  const [replyToEmail, setReplyToEmail] = useState('');
  const [emailSignature, setEmailSignature] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/email-settings');
        const data = await response.json();

        if (data.settings) {
          setSettings(data.settings);
          setSenderName(data.settings.sender_name || 'StayFlow');
          setReplyToEmail(data.settings.reply_to_email || '');
          setEmailSignature(data.settings.email_signature || '');
        }
      } catch (error) {
        console.error('Error fetching email settings:', error);
        toast.error('Failed to load email settings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/email-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_name: senderName,
          reply_to_email: replyToEmail || null,
          email_signature: emailSignature || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSettings(data.settings);
      toast.success('Email settings saved successfully!');
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            Configure organization-wide email settings for automated messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sender-name">Sender Name</Label>
            <Input
              id="sender-name"
              type="text"
              placeholder="StayFlow"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The name that appears in the "From" field of emails
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply-to">Reply-To Email (Optional)</Label>
            <Input
              id="reply-to"
              type="email"
              placeholder="support@yourdomain.com"
              value={replyToEmail}
              onChange={(e) => setReplyToEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Email address where guest replies will be sent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature">Email Signature (Optional)</Label>
            <Textarea
              id="signature"
              placeholder="Best regards,&#10;Your StayFlow Team"
              value={emailSignature}
              onChange={(e) => setEmailSignature(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Signature appended to all automated emails
            </p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How your emails will appear to guests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
            <div className="text-sm">
              <span className="font-medium">From:</span> {senderName} &lt;onboarding@resend.dev&gt;
            </div>
            {replyToEmail && (
              <div className="text-sm">
                <span className="font-medium">Reply-To:</span> {replyToEmail}
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <p className="text-sm text-muted-foreground">
                [Email content will appear here]
              </p>
              {emailSignature && (
                <div className="mt-4 text-sm whitespace-pre-wrap border-t pt-2">
                  {emailSignature}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
