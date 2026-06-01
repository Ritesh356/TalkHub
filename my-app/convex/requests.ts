import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    const requestsWithSender = (
      await Promise.all(
        requests.map(async (request) => {
          const sender = await ctx.db.get(request.sender);
          if (!sender) return null;
          return {
            request,
            sender,
          };
        })
      )
    ).filter((r) => r !== null);

    return requestsWithSender;
  },
});

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (args.email === identity.email) {
      throw new ConvexError("You cannot send a request to yourself");
    }

    let currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email!,
        username: identity.name || identity.nickname || "User",
        imageUrl: identity.pictureUrl || "",
      });
      currentUser = await ctx.db.get(userId);
    }

    if (!currentUser) throw new ConvexError("User not found");

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      return { status: "invite_needed", email: args.email, senderName: currentUser.username };
    }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (requestAlreadySent) throw new ConvexError("Request already sent");

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) throw new ConvexError("This user already sent you a request");

    // Check if they are already friends
    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();
    
    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();
      
    if (
      friends1.some((f) => f.user2 === receiver._id) ||
      friends2.some((f) => f.user1 === receiver._id)
    ) {
      throw new ConvexError("You are already friends with this user");
    }

    await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });
    
    return { status: "success" };
  },
});

export const deny = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new ConvexError("User not found");

    const request = await ctx.db.get(args.id);
    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("Request not found");
    }

    await ctx.db.delete(request._id);
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new ConvexError("User not found");

    const request = await ctx.db.get(args.id);
    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("Request not found");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    await ctx.db.insert("friends", {
      user1: currentUser._id,
      user2: request.sender,
      conversationId,
    });

    await ctx.db.insert("members", {
      userId: currentUser._id,
      conversationId,
    });

    await ctx.db.insert("members", {
      userId: request.sender,
      conversationId,
    });

    await ctx.db.delete(request._id);
  },
});
