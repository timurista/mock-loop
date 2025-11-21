"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
// Using inline SVG icons instead of heroicons to avoid dependencies

const navItems = [
  {
    label: "Dashboard",
    description: "Progress + streak",
    icon: "📊",
    href: "/dashboard",
  },
  {
    label: "Interview Studio",
    description: "Live coding room",
    icon: "🎬",
    href: "/interview-studio",
  },
  {
    label: "Scorecards",
    description: "Feedback archive",
    icon: "📋",
    href: "/scorecards",
  },
  {
    label: "Weekend Sprint",
    description: "3-loop blitz",
    icon: "⚡",
    href: "/weekend-sprint",
  },
  {
    label: "Coach Review",
    description: "Human boost",
    icon: "👨‍🏫",
    href: "/coach-review",
  },
];

export function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`flex h-screen flex-col bg-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-5">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-bold shadow-lg">
              ML
            </div>
            <div>
              <h1 className="text-base font-bold text-dark-800">MockLoop</h1>
              <p className="text-xs text-neutral-500">
                Interview OS for backend prep
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-bold shadow-lg mx-auto">
            ML
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-dark-600 transition-all"
        >
          {isCollapsed ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5">
        <div className="mb-6">
          <p
            className={`text-xs font-bold uppercase tracking-wider text-neutral-400 ${
              isCollapsed ? "text-center" : ""
            }`}
          >
            {isCollapsed ? "S" : "SECTIONS"}
          </p>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname === "/" && item.href === "/dashboard");
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-50 to-brand-100 text-brand-700 border border-brand-200 shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-dark-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-neutral-200 p-5">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-success-400 to-success-500 flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-800 truncate">
                  {user?.name || "Demo User"}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email || "demo@mockloop.com"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-dark-700 transition-all"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="flex w-full items-center justify-center rounded-xl p-3 text-neutral-600 hover:bg-neutral-100 hover:text-dark-700 transition-all"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
