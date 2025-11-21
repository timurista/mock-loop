"use client";

import { ReactNode, useState } from "react";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

interface AppLayoutProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
}

export function AppLayout({ children, rightSidebar }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm" />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl border-r border-neutral-200">
            <LeftSidebar />
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar - Fixed Position */}
      <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:border-r lg:border-neutral-200 lg:bg-white lg:shadow-sm">
        <LeftSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto lg:ml-64">
        <div className="mx-auto max-w-6xl space-y-8 p-4 lg:p-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-bold shadow-lg">
                ML
              </div>
              <div>
                <h1 className="text-base font-bold text-dark-800">MockLoop</h1>
                <p className="text-xs text-neutral-500">Interview OS</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2.5 text-neutral-400 hover:bg-white hover:text-dark-700 hover:shadow-sm transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            <div className="space-y-8">{children}</div>

            {/* Right Sidebar - Hidden on mobile */}
            {rightSidebar && (
              <div className="hidden xl:block xl:sticky xl:top-8 xl:self-start">
                <RightSidebar>{rightSidebar}</RightSidebar>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
