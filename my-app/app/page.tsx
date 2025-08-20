// app/page.tsx
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <SignedOut>
        <div>
          <h1>Welcome to TalkHub</h1>
          <p>Please click the sign-in button to get started.</p>
          {/* This is where your sign-in button or link would go */}
        </div>
      </SignedOut>
      <SignedIn>
        <div>
          <h1>You are signed in!</h1>
          <p>Access your dashboard and manage your account.</p>
          <UserButton />
        </div>
      </SignedIn>
    </main>
  );
}