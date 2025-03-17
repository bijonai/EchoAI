/* eslint-disable @next/next/no-img-element */
"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { createHash } from "crypto";
import { useEffect, useState } from "react";

interface UserPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

export function UserPanel({ isOpen, setIsOpen, onLogout }: UserPanelProps) {
  const [claims, setClaims] = useState<unknown>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gravatarUrl, setGravatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch("/auth/status");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setClaims(data.claims);
        const email = data.claims?.email || "";
        const hash = createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex");
        setGravatarUrl(`https://www.gravatar.com/avatar/${hash}`);
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl py-6 px-4
          transition-all duration-300 ease-in-out
          ${isOpen ? "block" : "hidden"}
          w-100 z-50 flex flex-col items-center justify-center gap-8`}
      >
        {isLoading && (
          <ReloadIcon className="w-5 h-5 text-gray-700 animate-spin" />
        )}

        {!isLoading && (
          <>
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src={gravatarUrl || ""}
                alt="Gravatar"
                className="w-25 h-25 rounded-full"
              />
              <div className="text-2xl font-bold">{claims?.name}</div>
              <div className="text-md text-gray-500">@{claims?.username}</div>
              <div className="text-md text-gray-500">{claims?.email}</div>
            </div>
            <div className="flex flex-rol items-center justify-center gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full w-full"
              >
                Close
              </button>
              <button
                onClick={onLogout}
                className="bg-[#87ceeb] text-gray-900 px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
