import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessTokenAction } from "./functions/user-control";
import { createConnection } from "@echoai/api";

interface HistoryItem {
  id: string;
  title: string;
  date: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

export default function HistoryPanel({
  isOpen,
  setIsOpen,
  onClose,
}: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    getAccessTokenAction().then((res) => {
      setToken(res);
    });
  }, [isOpen]);

  useEffect(() => {
    createConnection({ token })
      .chat.history()
      .then((res) => {
        setHistory(
          res.map((item) => ({
            id: item.id,
            title: item.updated_at,
            date: item.updated_at,
          }))
        );
      });
  }, [isOpen, token]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white/90 backdrop-blur-sm shadow-xl
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-80 z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-800">History</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div
              className="p-4 bg-[#EBEBDB] rounded-xl hover:opacity-65 cursor-pointer transition-colors duration-200"
              onClick={() => {
                router.push("/");
                setIsOpen(false);
              }}
            >
              <div className="font-medium text-gray-800">+ New</div>
            </div>

            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  router.push(`/chat/${item.id}`);
                  setIsOpen(false);
                }}
              >
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
