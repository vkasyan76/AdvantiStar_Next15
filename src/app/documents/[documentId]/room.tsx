"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./actions"; // Assuming getUsers is imported from actions.ts
import { toast } from "sonner";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  type User = { id: string; name: string; avatar: string };

  const [users, setUsers] = useState<User[]>([]);

  // Fetch users using useMemo to avoid unnecessary re-creation
  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    []
  );

  // Trigger the fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      // publicApiKey={
      //   "pk_dev_9L6DCe9tP4hTN5Zyai4Xt0VuuFxtgD3aNT_C6HD4yRTtVEvwb9ZH6UX5uYvwaqgl"
      // }
      throttle={16}
      authEndpoint="/api/liveblocks-auth"
      // iterates over userIds and returns the matching user or undefined if not found.
      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}
      // filters the users by checking if the name contains the search text (case-insensitive).
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
