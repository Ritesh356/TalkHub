"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "./_components/Header";
import { Body } from "./_components/Body";
import { ChatInput } from "./_components/ChatInput";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{
    conversationId: Id<"conversations">;
  }>;
};

const ConversationPage = ({ params }: Props) => {
  const { conversationId } = use(params);
  const conversation = useQuery(api.conversation.get, { id: conversationId });

  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const name = (conversation.isGroup 
    ? conversation.name 
    : conversation.otherUser?.username) || "Unknown User";
    
  const imageUrl = (conversation.isGroup 
    ? "" // Group image
    : conversation.otherUser?.imageUrl) || "";

  return (
    <div className="w-full h-full flex flex-col bg-background/50 relative overflow-hidden">
      {/* Decorative gradient blob background to match reference aesthetic */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <Header name={name} imageUrl={imageUrl} />
      <Body conversationId={conversationId} />
      <ChatInput conversationId={conversationId} />
    </div>
  );
};

export default ConversationPage;
