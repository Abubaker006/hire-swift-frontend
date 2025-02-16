"use client";
import React from "react";
import ReduxProvider from "@/hooks/Provider/ReduxProvider";
import Loader from "@/utils/loader";
import DashbaordLayoutWrapper from "./dashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <DashbaordLayoutWrapper>
        <Loader />
        {children}
      </DashbaordLayoutWrapper>
    </ReduxProvider>
  );
}
