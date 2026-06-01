import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            clerkId: result.data.id,
            email: result.data.email_addresses[0]?.email_address,
            imageUrl: result.data.image_url,
            username: result.data.username || result.data.first_name || "User",
          });
          break;
        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            clerkId: result.data.id,
            imageUrl: result.data.image_url,
            email: result.data.email_addresses[0]?.email_address,
            username: result.data.username || result.data.first_name || "User",
          });
          break;
        case "user.deleted":
          // Optionally handle user.deleted event
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error("Webhook Error:", err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
