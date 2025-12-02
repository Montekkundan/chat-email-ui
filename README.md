# Chat Email UI Demo

A minimal demo showing how to **render visual interfaces in chat** using the [AI SDK v6](https://v6.ai-sdk.dev/cookbook/next/render-visual-interface-in-chat) tool calling pattern.

## Features

- **Tool Calling**: Uses the `generateDraftEmail` tool to generate email drafts based on user requests
- **Visual Components**: Renders a custom `EmailCard` React component directly in the chat interface
- **Interactive UI**: The email card allows editing recipient/subject fields, copying the draft, and opening in email clients (Gmail, Outlook, or default)
- **Placeholder Highlighting**: Displays `[placeholders]` in the email body with visual styling to indicate fields needing user input

## How It Works

Based on the [AI SDK cookbook pattern](https://v6.ai-sdk.dev/cookbook/next/render-visual-interface-in-chat), this demo uses **tool calling to render React components** in chat:

1. **Server-side tool definition** (`app/api/chat/route.ts`):
   - The `generateDraftEmail` tool is defined with a Zod schema for inputs (`to`, `subject`, `body`)
   - The `execute` function returns structured data (not just text)
   - AI SDK streams the tool call back to the client with `toUIMessageStreamResponse()`

2. **Client-side rendering** (`app/page.tsx`):
   - The `useChat` hook receives tool calls as message parts
   - When a `tool-generateDraftEmail` part appears with `state === 'output-available'`, the client renders the `EmailCard` component
   - Tool output data is passed as props to the visual component

This pattern allows the LLM to call tools that return **visual interfaces instead of text**, creating rich, interactive experiences within the chat flow.

## Quick Start

```bash
# Clone and install
bun install

# Add your AI_GATEWAY_API_KEY to .env
AI_GATEWAY_API_KEY=your_key_here

# Run dev server
bun dev
```

Try asking: *"Draft an email to my professor asking for an extension"*