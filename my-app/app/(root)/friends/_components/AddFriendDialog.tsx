"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty" })
    .email("Please enter a valid email"),
});
export const AddFriendDialog = () => {
  const createRequest = useMutation(api.requests.create);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const sendInviteEmail = useAction(api.actions.sendInviteEmail);

  const onSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
    try {
      const result = await createRequest({ email: values.email });
      
      if (result && result.status === "invite_needed") {
        const wantsToInvite = window.confirm(
          "This user isn't on TalkHub yet! Do you want to send them an email invitation?"
        );
        if (wantsToInvite) {
          const emailResult = await sendInviteEmail({ 
            email: result.email, 
            senderName: result.senderName 
          });
          if (emailResult.success) {
            toast.success("Invitation email sent successfully!");
          } else {
            toast.error("Failed to send invitation email.");
          }
        }
      } else {
        toast.success("Friend request sent!");
      }
      
      reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof ConvexError) {
        setError("email", { message: error.data as string });
      } else {
        setError("email", { message: "Unexpected error occurred" });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full">
              <UserPlus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Friend</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with your friends!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email..." {...register("email")} />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
