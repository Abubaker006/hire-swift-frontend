"use client";

import ReduxProvider from "@/hooks/Provider/ReduxProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
