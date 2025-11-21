// removed 'use client' to fix metadata export error

import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ClientLayout } from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "MockLoop",
  description: "AI-powered mock interview studio for Python backend engineers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
