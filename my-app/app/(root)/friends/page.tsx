"use client";

import React from "react";
import { ItemList } from "@/components/shared/item-list/ItemList";
import { AddFriendDialog } from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, MessageSquare } from "lucide-react";
import { Request } from "./_components/Request";

const FriendsPage = () => {
  const requests = useQuery(api.requests.get);

  return (
    <div className="w-full h-full flex flex-row">
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">
                Pending Requests
              </h3>
              {requests.map((req) => (
                <Request
                  key={req.request._id}
                  id={req.request._id}
                  imageUrl={req.sender.imageUrl}
                  username={req.sender.username}
                  email={req.sender.email}
                />
              ))}
            </div>
          ) : (
            <p className="w-full h-full flex items-center justify-center text-muted-foreground">
              No new requests
            </p>
          )
        ) : (
          <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4 text-muted-foreground" />
        )}
      </ItemList>
      
      {/* Main chat empty state placeholder */}
      <div className="hidden lg:flex w-full h-full flex-col items-center justify-center bg-accent/20">
        <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50">
          <MessageSquare className="w-24 h-24" />
          <h2 className="text-2xl font-semibold">Select a conversation</h2>
          <p>Choose an existing conversation or start a new one!</p>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
