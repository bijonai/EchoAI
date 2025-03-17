"use client";

import { PersonIcon } from "@radix-ui/react-icons";
import { createHash } from "crypto";

interface UserAvatarProps {
  isAuthenticated: boolean;
  isUserPanelOpen: boolean;
  setUserPanelOpen: (isOpen: boolean) => void;
  claims: unknown;
  onLogin: () => void;
  onLogout: () => void;
}

export function UserAvatar({
  isAuthenticated,
  claims,
  isUserPanelOpen,
  setUserPanelOpen,
  onLogin,
  onLogout,
}: UserAvatarProps) {
  const email = claims?.email || "";
  const hash = createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}`;

  return (
    <>
      <button
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() =>
          isAuthenticated ? setUserPanelOpen(!isUserPanelOpen) : onLogin()
        }
      >
        {!isAuthenticated ? (
          <PersonIcon className={`w-5 h-5 text-gray-700`} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gravatarUrl} alt="User" className="w-5 h-5 rounded-full" />
        )}
      </button>
    </>
  );
}
