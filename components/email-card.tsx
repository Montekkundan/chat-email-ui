"use client";

import { Copy, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EmailCardProps = {
  to: string;
  subject: string;
  body: string;
};

export function EmailCard({
  to: initialTo,
  subject: initialSubject,
  body,
}: EmailCardProps) {
  const [copied, setCopied] = useState(false);
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);

  const handleCopy = () => {
    const fullEmail = `To: ${to}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmail = (client: "default" | "gmail" | "outlook") => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    let url: string;

    switch (client) {
      case "gmail":
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodedSubject}&body=${encodedBody}`;
        break;
      case "outlook":
        url = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${encodedSubject}&body=${encodedBody}`;
        break;
      default:
        url = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    window.open(url, "_blank");
  };

  const renderBody = (text: string) => {
    // Split by placeholders like [text]
    const parts = text.split(/(\[.*?\])/g);
    let charPosition = 0;

    return parts.map((part) => {
      const key = `${part.substring(0, 20)}-${charPosition}`;
      charPosition += part.length;

      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span
            className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary"
            key={key}
          >
            {part}
          </span>
        );
      }
      return <span key={key}>{part}</span>;
    });
  };

  return (
    <Card className="my-4 w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-semibold text-sm">Email Draft</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <Button
              className="h-8 w-8"
              onClick={handleCopy}
              size="icon"
              variant="ghost"
            >
              {copied ? (
                <span className="font-medium text-xs">✓</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8" size="icon" variant="ghost">
                  <Mail className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Open in</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenEmail("default")}>
                  Default Email App
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenEmail("gmail")}>
                  Gmail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenEmail("outlook")}>
                  Outlook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* To */}
        <div className="space-y-2">
          <Label
            className="font-medium text-muted-foreground text-sm"
            htmlFor="email-to"
          >
            To
          </Label>
          <Input
            className="text-sm"
            id="email-to"
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            type="email"
            value={to}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label
            className="font-medium text-muted-foreground text-sm"
            htmlFor="email-subject"
          >
            Subject
          </Label>
          <Input
            className="font-medium text-sm"
            id="email-subject"
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            type="text"
            value={subject}
          />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Body - Read Only with Highlighted Placeholders */}
        <div className="space-y-2">
          <Label className="font-medium text-muted-foreground text-sm">
            Body
          </Label>
          <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm leading-relaxed">
            {renderBody(body)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
