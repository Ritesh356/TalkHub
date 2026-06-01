import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return null;

    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new ConvexError("Conversation not found");

    const membership = await ctx.db
      .query("members")
      .withIndex("by_userId_conversationId", (q) =>
        q.eq("userId", currentUser._id).eq("conversationId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .collect();

    let otherUser = null;
    if (!conversation.isGroup) {
      const otherMember = allMembers.find(
        (m) => m.userId !== currentUser._id
      );
      if (otherMember) {
        otherUser = await ctx.db.get(otherMember.userId);
      }
    }

    return {
      ...conversation,
      otherUser,
    };
  },
});
