"use client";

import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/clerk-react";
import { FullscreenLoader } from "./fullscreen-loader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated> {children}</Authenticated>
        <Unauthenticated>
          {/* <p> Please log in</p> */}
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* if we use imports "@clerk/nextjs" instead of "@clerk/clerk-react"; */}
            <SignIn />
          </div>
        </Unauthenticated>
        <AuthLoading>
          {/* <p>Loading auth...</p> */}
          <FullscreenLoader label="Auth loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
