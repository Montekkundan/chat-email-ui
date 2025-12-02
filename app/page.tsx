"use client";
import { useChat } from "@ai-sdk/react";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment, type SetStateAction, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { EmailCard } from "@/components/email-card";
import { EmailCardSkeleton } from "@/components/email-card-skeleton";
import { Settings } from "@/components/settings";

const suggestions = [
  "Draft an email to a professor about joining their research lab",
  "Write a cold email for a software engineering internship",
  "Create an outreach email for a collaborative project",
];

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, regenerate, stop, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    // @ts-expect-error I dont know why this is happening
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    sendMessage(
      {
        // @ts-expect-error ditto
        text: message.text,
      },
      {
        body: {
          apiKey: localStorage.getItem("AI_GATEWAY_API_KEY") || undefined,
        },
      }
    );
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      {
        body: {
          apiKey: localStorage.getItem("AI_GATEWAY_API_KEY") || undefined,
        },
      }
    );
    setInput("");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Settings />
      </div>
      <div className="relative mx-auto size-full h-screen max-w-4xl p-6">
        <div className="flex h-full flex-col">
          <Conversation>
            <ConversationContent>
              {messages.map((message, messageIndex) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text": {
                        const isLastMessage =
                          messageIndex === messages.length - 1;
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
                              </MessageContent>
                            </Message>
                            {message.role === "assistant" && isLastMessage && (
                              <MessageActions>
                                <MessageAction
                                  label="Retry"
                                  onClick={() => regenerate()}
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </MessageAction>
                                <MessageAction
                                  label="Copy"
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            )}
                          </Fragment>
                        );
                      }
                      case "tool-generateDraftEmail":
                        if (part.state === "output-available") {
                          const { to, subject, body } = part.output as any;
                          return (
                            <div className="w-full" key={part.toolCallId}>
                              <EmailCard
                                body={body || ""}
                                subject={subject || ""}
                                to={to || ""}
                              />
                            </div>
                          );
                        }
                        // Show skeleton while tool is being executed
                        return (
                          <div className="w-full" key={part.toolCallId}>
                            <EmailCardSkeleton />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="mt-4 grid gap-4">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  disabled={status === "streaming" || status === "submitted"}
                  key={suggestion}
                  onClick={handleSuggestionClick}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>

            <PromptInput globalDrop multiple onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  disabled={status === "streaming" || status === "submitted"}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => setInput(e.target.value)}
                  placeholder="Lets have fun with tool calling..."
                  value={input}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu />
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!(input || status)}
                  status={status}
                  stop={stop}
                />
              </PromptInputFooter>
            </PromptInput>
            <p className="mx-auto font-light text-xs">
              Thank you{" "}
              <a
                className="text-black transition-colors hover:text-green-700"
                href="https://vercel.com"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Vercel ▲
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
