"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
});

type Props = {
  conversationId: Id<"conversations">;
};

export const ChatInput = ({ conversationId }: Props) => {
  const createMessage = useMutation(api.messages.create);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await createMessage({
        conversationId,
        content: [storageId],
        type: file.type.startsWith("image/") ? "image" : "file",
      });
    } catch (err) {
      console.error("Failed to upload file", err);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    const currentMessage = getValues("content");
    setValue("content", currentMessage + emojiObject.emoji);
  };

  const onSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    try {
      await createMessage({
        conversationId,
        content: [values.content],
        type: "text",
      });
      reset();
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="w-full p-4 shrink-0 mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 p-2 rounded-full border bg-card relative"
      >
        <label className="rounded-full text-muted-foreground shrink-0 cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Paperclip className="w-5 h-5" />
        </label>
        <input
          {...register("content")}
          placeholder="Type your message here..."
          className="flex-1 bg-transparent border-none outline-none text-sm px-2"
          autoComplete="off"
        />
        <div className="relative">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full text-muted-foreground shrink-0"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile className="w-5 h-5" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full px-6 bg-blue-500 hover:bg-blue-600 text-white shrink-0 shadow-md transition-all ml-2"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
