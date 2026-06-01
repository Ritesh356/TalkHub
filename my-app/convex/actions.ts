"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

export const sendInviteEmail = action({
  args: {
    email: v.string(),
    senderName: v.string(),
  },
  handler: async (ctx, args) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: args.email,
      subject: `Invitation to join TalkHub from ${args.senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-4 border rounded-lg shadow-sm">
          <h2 style="color: #3b82f6;">Join TalkHub!</h2>
          <p>Hello,</p>
          <p><strong>${args.senderName}</strong> has invited you to join them on <strong>TalkHub</strong>, a real-time chat application.</p>
          <p>Click the link below to sign up and connect with them instantly:</p>
          <a href="http://localhost:3000" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Join TalkHub</a>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">If you do not know the sender, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: "Failed to send invitation email." };
    }
  },
});
