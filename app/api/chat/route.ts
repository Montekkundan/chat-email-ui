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
      "You are a helpful assistant that can answer questions and help with tasks. You can draft emails for the user using the generateDraftEmail tool.",
    tools: {
      generateDraftEmail: tool({
        description: "Generate a draft email based on the user request.",
        inputSchema: z.object({
          to: z.string().describe("The recipient email address"),
          subject: z.string().describe("The email subject"),
          body: z
            .string()
            .describe(
              "The email body content. Use [Placeholder Name] for parts that need user input."
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
