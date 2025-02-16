"use client";
import ReduxProvider from "@/hooks/Provider/ReduxProvider";
import Loader from "@/utils/loader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <Loader />
      {children}
    </ReduxProvider>
  );
}
