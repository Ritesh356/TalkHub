"use client"
import React from 'react';
import { ConvexReactClient } from 'convex/react'
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from 'convex/react-clerk'






type Props = {
    children:React.ReactNode
}
const CONVEX_URL=process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex =new ConvexReactClient(CONVEX_URL)
const ConvexClientProvider = ({children}: Props) => {
  return(
     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
   (<ConvexProviderWithClerk  client={convex} useAuth={useAuth}>
      {children}
   </ConvexProviderWithClerk>)
  </ClerkProvider>
  )
 
}

export default ConvexClientProvider;