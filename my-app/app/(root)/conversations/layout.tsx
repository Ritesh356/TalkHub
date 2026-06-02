"use client";

import React from "react";
import { ItemList } from "@/components/shared/item-list/ItemList";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = useQuery(api.conversations.get);
  const params = useParams();
  const isActive = !!params?.conversationId;

  return (
    <div className="w-full h-full flex flex-row">
      <ItemList 
        title="Conversations" 
        isActive={isActive}
        action={
          <Button size="icon" variant="outline" className="rounded-full">
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        }
      >
        {conversations ? (
          conversations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {conversations.map((conv) => {
                const name = conv.conversation.isGroup 
                  ? conv.conversation.name 
                  : conv.otherUser?.username || "Unknown User";
                  
                const imageUrl = conv.conversation.isGroup 
                  ? "" // handle group image later
                  : conv.otherUser?.imageUrl;

                const lastMessageContent = conv.lastMessage?.content[0] || "Started a conversation";

                return (
                  <Link 
                    href={`/conversations/${conv.conversation._id}`} 
                    key={conv.conversation._id}
                    className="w-full p-3 flex items-center justify-between gap-4 border-b hover:bg-accent/50 transition-colors cursor-pointer rounded-lg"
                  >
                    <div className="flex items-center gap-4 truncate">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>{name?.slice(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col truncate">
                        <h4 className="truncate font-semibold text-sm">{name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{lastMessageContent}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="w-full h-full flex items-center justify-center text-muted-foreground">
              No conversations yet
            </p>
          )
        ) : (
          <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4 text-muted-foreground" />
        )}
      </ItemList>
      
      <div className={`flex-1 w-full h-full overflow-hidden ${!isActive ? "hidden lg:block" : "block"}`}>
        {children}
      </div>
    </div>
  );
}
