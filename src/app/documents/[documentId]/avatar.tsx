"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Separator } from "@/components/ui/separator";

const AVATAR_SIZE = 36;

interface AvatarProps {
  src: string;
  name: string;
}

// Avatar component to render individual user avatars
const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400"
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded bg-black whitespace-nowrap transition-opacity">
        {name}
      </div>
      <img alt={name} src={src} className="size-full rounded-full" />
    </div>
  );
};

// AvatarStack component to display a list of users in the room
const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();
  // no avatars shown if only one user
  if (users.length === 0) return null;

  return (
    <div className="flex items-center">
      {currentUser && (
        <div className="relative ml-2">
          <Avatar src={currentUser.info.avatar} name="You" />
        </div>
      )}
      <div className="flex">
        {users.map(({ connectionId, info }) => (
          <Avatar key={connectionId} src={info.avatar} name={info.name} />
        ))}
      </div>
      <Separator orientation="vertical" className="h-6" />
    </div>
  );
};

// Exported Avatars component with suspense for loading state
export const Avatars = () => {
  return (
    // Room loader will not be shown
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};
