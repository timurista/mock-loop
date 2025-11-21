"use client";

import { AuthProvider } from "../components/AuthProvider";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
