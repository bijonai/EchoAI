"use client";

import { useEffect, useState } from "react";
import { UserAvatar } from "./user-avatar";
import { signInAction, signOutAction } from "./functions/user-control";
import { ReloadIcon } from "@radix-ui/react-icons";

interface AuthProps {
  isUserPanelOpen: boolean;
  setUserPanelOpen: (isOpen: boolean) => void;
}

export function Auth({ isUserPanelOpen, setUserPanelOpen }: AuthProps) {
  const [claims, setClaims] = useState<unknown>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch("/auth/status");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setClaims(data.claims);
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <ReloadIcon className="w-5 h-5 text-gray-700 animate-spin" />
      </div>
    );
  }

  return (
    <UserAvatar
      isAuthenticated={isAuthenticated}
      claims={claims}
      isUserPanelOpen={isUserPanelOpen}
      setUserPanelOpen={setUserPanelOpen}
      onLogin={signInAction}
      onLogout={signOutAction}
    />
  );
}
