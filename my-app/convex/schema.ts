import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    username: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  }).index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),

  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations"),
  }).index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),

  members: defineTable({
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeenMessageId: v.optional(v.id("messages")),
  }).index("by_userId", ["userId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_userId_conversationId", ["userId", "conversationId"]),

  messages: defineTable({
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_conversationId", ["conversationId"]),
});
