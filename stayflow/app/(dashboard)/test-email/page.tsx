'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendTestEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Test email sent successfully!', {
        description: `Email sent to ${email}`,
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendBookingEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Booking email sent successfully!', {
        description: `Email sent to ${email}`,
      });
    } catch (error) {
      console.error('Error sending booking email:', error);
      toast.error('Failed to send booking email', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Email Sending</h1>
        <p className="text-muted-foreground">
          Send test emails to verify Resend integration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simple Test Email</CardTitle>
            <CardDescription>
              Send a basic welcome email template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendTestEmail}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Notification Email</CardTitle>
            <CardDescription>
              Send a sample booking notification with realistic data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="booking-email">Recipient Email</Label>
              <Input
                id="booking-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendBookingEmail}
              disabled={isSending}
              className="w-full"
              variant="secondary"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Booking Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Get Resend API Key</h3>
            <p className="text-sm text-muted-foreground">
              Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com</a> and get your API key
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">2. Update Environment Variables</h3>
            <p className="text-sm text-muted-foreground">
              Add to your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>:
            </p>
            <pre className="bg-muted p-3 rounded-lg text-xs">
              RESEND_API_KEY=re_your_actual_api_key
            </pre>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">3. Restart Dev Server</h3>
            <p className="text-sm text-muted-foreground">
              After updating .env.local, restart your development server to load the new variables
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
