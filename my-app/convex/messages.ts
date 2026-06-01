import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.array(v.string()),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new ConvexError("User not found");

    const membership = await ctx.db
      .query("members")
      .withIndex("by_userId_conversationId", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      content: args.content,
      type: args.type,
    });

    return message;
  },
});

export const get = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    const membership = await ctx.db
      .query("members")
      .withIndex("by_userId_conversationId", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        if (!sender) throw new ConvexError("Sender not found");

        let content = message.content;
        if (message.type === "image" || message.type === "file") {
          content = await Promise.all(
            message.content.map(async (storageId) => {
              const url = await ctx.storage.getUrl(storageId as Id<"_storage">);
              return url ?? storageId;
            })
          );
        }

        return {
          message: { ...message, content },
          sender,
          isCurrentUser: sender._id === currentUser._id,
        };
      })
    );

    return messagesWithSender;
  },
});
