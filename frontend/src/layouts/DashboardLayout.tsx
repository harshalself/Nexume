import * as React from "react";
import { Sidebar } from "../components/Sidebar";
import DashboardNav from "../components/DashboardNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const DashboardLayout = ({ children, noPadding }: DashboardLayoutProps) => (
  <div className="h-screen flex overflow-hidden bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <DashboardNav />
      <main className={`flex-1 ${noPadding ? "" : "overflow-y-auto"}`}>
        <div
          className={
            noPadding ? "h-full" : "container mx-auto p-4 lg:p-6 max-w-7xl"
          }>
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
