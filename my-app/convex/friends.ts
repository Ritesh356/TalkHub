import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new ConvexError("User not found");

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId =
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1;

        const friend = await ctx.db.get(friendId);
        if (!friend) throw new ConvexError("Friend not found");
        return {
          friend,
          conversationId: friendship.conversationId,
        };
      })
    );

    return friends;
  },
});
