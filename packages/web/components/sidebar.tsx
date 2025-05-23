"use client";

import {
  CounterClockwiseClockIcon,
  CubeIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import HistoryPanel from "./history-panel";
import { useRouter } from "next/navigation";
import { Auth } from "./auth";
import { UserPanel } from "./user-panel";
import { signOutAction } from "./functions/user-control";

export function Sidebar() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const router = useRouter();

  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

  return (
    <>
      <div className="h-full w-16 flex flex-col justify-between p-3 backdrop-blur-sm">
        <div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <CounterClockwiseClockIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {
              router.push("/community");
            }}
          >
            <CubeIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <GearIcon className="w-5 h-5 text-gray-700" />
          </button>
          <Auth
            isUserPanelOpen={isUserPanelOpen}
            setUserPanelOpen={setIsUserPanelOpen}
          />
        </div>
      </div>
      <UserPanel
        isOpen={isUserPanelOpen}
        setIsOpen={setIsUserPanelOpen}
        onLogout={() => {
          signOutAction();
        }}
      />
      <HistoryPanel
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </>
  );
}
