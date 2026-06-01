import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      memberships.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) throw new ConvexError("Conversation not found");

        const allMembers = await ctx.db
          .query("members")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", membership.conversationId)
          )
          .collect();

        // If it's a 1-on-1, get the other user's info
        let otherUser = null;
        if (!conversation.isGroup) {
          const otherMember = allMembers.find(
            (m) => m.userId !== currentUser._id
          );
          if (otherMember) {
            otherUser = await ctx.db.get(otherMember.userId);
          }
        }

        // Get last message
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();

        return {
          conversation,
          otherUser,
          lastMessage,
        };
      })
    );

    return conversations;
  },
});
