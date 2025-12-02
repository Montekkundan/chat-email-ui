import { createGateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    apiKey,
  }: {
    messages: UIMessage[];
    apiKey?: string;
  } = await req.json();

  const gateway = createGateway({
    apiKey: apiKey || process.env.AI_GATEWAY_API_KEY,
  });

  const result = streamText({
    model: gateway("openai/gpt-4o"),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful email drafting assistant. When the user asks you to draft or write an email, ALWAYS use the generateDraftEmail tool immediately. Do not ask for additional information first. Instead, create a complete draft using descriptive placeholders like [Professor's Email], [Your Name], [Specific Research Interest], etc. for any missing details. The user can edit these placeholders in the visual interface.",
    tools: {
      generateDraftEmail: tool({
        description:
          "Draft an email for the user. Use this tool whenever the user requests an email to be written or drafted. Include descriptive placeholders in square brackets (e.g., [Professor Name], [Your Research Interest]) for any information not provided by the user.",
        inputSchema: z.object({
          to: z
            .string()
            .describe(
              "The recipient email address. Use a placeholder like [recipient@university.edu] if not provided."
            ),
          subject: z.string().describe("The email subject line"),
          body: z
            .string()
            .describe(
              "The complete email body. Use [Placeholder Name] syntax for any missing user-specific details like names, dates, or specific reasons."
            ),
        }),
        execute: async ({
          to,
          subject,
          body,
        }: {
          to: string;
          subject: string;
          body: string;
        }) => ({ to, subject, body }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
