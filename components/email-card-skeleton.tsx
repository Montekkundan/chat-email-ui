"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailCardSkeleton() {
  return (
    <Card className="my-4 w-full max-w-2xl animate-pulse">
      <CardHeader>
        <CardTitle className="font-semibold text-sm">Email Draft</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* To field skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-6 rounded bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
        </div>

        {/* Subject field skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-14 rounded bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Body skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-10 rounded bg-muted" />
          <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
