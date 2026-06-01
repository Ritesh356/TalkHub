import React from "react";
import { MessageSquarePlus } from "lucide-react";

const ConversationsPage = () => {
  return (
    <div className="hidden lg:flex w-full h-full flex-col items-center justify-center bg-accent/20">
      <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50">
        <MessageSquarePlus className="w-24 h-24" />
        <h2 className="text-2xl font-semibold">TalkHub</h2>
        <p>Select a conversation to start chatting!</p>
      </div>
    </div>
  );
};

export default ConversationsPage;
