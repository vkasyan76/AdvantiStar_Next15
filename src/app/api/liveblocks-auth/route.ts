import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Liveblocks client
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  // Authenticate session and retrieve session claims
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Log session claims for debugging
  //   console.log(sessionClaims);

  // Retrieve current user information
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Extract room information from request body
  const { room } = await req.json();

  // Query Convex to fetch the document by ID
  const document = await convex.query(api.documents.getById, { id: room });

  // Return unauthorized if the document is not found
  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if the current user is the document owner
  const isOwner = document.ownerId === user.id;

  // Check if the user is part of the organization that owns the document.
  // Before cehcking this, make sure that organizationId exists for this document
  const isOrganizationMember = !!(
    document.organizationId && document.organizationId === sessionClaims.org_id
  );

  //   console.log(isOwner, isOrganizationMember);

  // Deny access if the user is neither the owner nor part of the organization
  if (!isOwner && !isOrganizationMember) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Prepare Liveblocks session with user information
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName ?? "Anonymous",
      avatar: user.imageUrl,
    },
  });

  // Grant full access to the specified room
  session.allow(room, session.FULL_ACCESS);

  // Authorize session and return response
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
