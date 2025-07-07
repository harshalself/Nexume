"use client";

import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { homepageConfig } from "../config/homepageConfig";
import { dashboardNavigation } from "../config/dashboardConfig";

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 hover:bg-muted hover:text-primary"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar">
        {isMobileOpen ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </Button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-background border-r transition-all duration-300 ease-in-out lg:static lg:z-20 h-screen",
          isCollapsed ? "w-[72px]" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
        {/* Header */}
        <div className="border-b border-border flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 px-4 h-14",
              isCollapsed && "justify-center px-2"
            )}>
            <Link to="/" className="flex items-center font-semibold space-x-2">
              <div
                className={cn(
                  "p-1 rounded-lg gradient-accent",
                  isCollapsed && "ml-2"
                )}>
                {homepageConfig.branding.logoIcon && (
                  <homepageConfig.branding.logoIcon className="h-6 w-6 text-primary" />
                )}
              </div>
              {!isCollapsed && (
                <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {homepageConfig.branding.appName}
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "ml-auto h-8 w-8 hidden lg:flex hover:bg-muted hover:text-primary",
                isCollapsed && "ml-0"
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}>
              <svg
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">
                {isCollapsed ? "Expand" : "Collapse"} Sidebar
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {dashboardNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "sidebar-active text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-primary dark:hover:bg-blue-900/20",
                    isCollapsed && "justify-center px-2"
                  )}>
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      !isCollapsed && "mr-3",
                      isActive && "text-primary"
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
