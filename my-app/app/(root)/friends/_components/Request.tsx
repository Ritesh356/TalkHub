import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Props = {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
};

export const Request = ({ id, imageUrl, username, email }: Props) => {
  const acceptRequest = useMutation(api.requests.accept);
  const denyRequest = useMutation(api.requests.deny);

  return (
    <div className="w-full p-2 flex items-center justify-between gap-2 border rounded-xl bg-card transition-all duration-300 hover:bg-accent hover:text-accent-foreground cursor-pointer">
      <div className="flex items-center gap-4 truncate">
        <Avatar className="w-10 h-10">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{username.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate font-medium">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
          onClick={() => {
            acceptRequest({ id })
              .then(() => toast.success("Friend request accepted"))
              .catch((error) => toast.error("Failed to accept request"));
          }}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => {
            denyRequest({ id })
              .then(() => toast.success("Friend request denied"))
              .catch((error) => toast.error("Failed to deny request"));
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
