"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  conversationId: Id<"conversations">;
};

export const Body = ({ conversationId }: Props) => {
  const messages = useQuery(api.messages.get, { conversationId });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-4" ref={scrollRef}>
      {messages.map((msg, index) => {
        const isCurrentUser = msg.isCurrentUser;
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const isSameSender = previousMessage?.sender._id === msg.sender._id;

        return (
          <div
            key={msg.message._id}
            className={cn(
              "flex w-full",
              isCurrentUser ? "justify-end" : "justify-start",
              isSameSender ? "mt-1" : "mt-4"
            )}
          >
            <div className={cn("flex gap-2 max-w-[75%]", isCurrentUser && "flex-row-reverse")}>
              {!isCurrentUser && (
                <Avatar className={cn("w-8 h-8 shrink-0", isSameSender && "opacity-0 invisible")}>
                  <AvatarImage src={msg.sender.imageUrl} />
                  <AvatarFallback>{msg.sender.username?.slice(0, 1).toUpperCase() || "?"}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "p-3 rounded-2xl flex flex-col shadow-sm text-sm overflow-hidden",
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                )}
              >
                {msg.message.type === "image" ? (
                  <img src={msg.message.content[0]} alt="Attachment" className="max-w-[250px] max-h-[250px] object-cover rounded-md" />
                ) : msg.message.type === "file" ? (
                  <a href={msg.message.content[0]} target="_blank" rel="noopener noreferrer" className="underline break-all">
                    View Attached File
                  </a>
                ) : (
                  msg.message.content.map((content, idx) => (
                    <p key={idx} className="break-words">{content}</p>
                  ))
                )}
              </div>

              {isCurrentUser && (
                <Avatar className={cn("w-8 h-8 shrink-0", isSameSender && "opacity-0 invisible")}>
                  <AvatarImage src={msg.sender.imageUrl} />
                  <AvatarFallback>{msg.sender.username?.slice(0, 1).toUpperCase() || "?"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
