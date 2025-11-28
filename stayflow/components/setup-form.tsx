"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const setupSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name must be less than 100 characters"),
});

type SetupFormValues = z.infer<typeof setupSchema>;

interface SetupFormProps {
  userId: string;
}

export function SetupForm({ userId }: SetupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  const onSubmit = async (values: SetupFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      console.log("Submitting organization creation:", values.organizationName);

      // Call the API route instead of calling createOrganization directly
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.organizationName,
        }),
      });

      console.log("API response status:", response.status);

      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create organization");
      }

      console.log("Organization created successfully, redirecting to dashboard");

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Organization creation error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "Failed to create organization. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Organization</CardTitle>
        <CardDescription>
          Enter a name for your organization to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Properties"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the name of your property management organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}