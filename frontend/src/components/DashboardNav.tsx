"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { homepageConfig } from "../config/homepageConfig";
import { ThemeToggle } from "./ThemeToggle";
import { Notifications } from "./Notifications";
import {
  dashboardPathMap,
  dashboardUserMenuOptions,
  dashboardSearchPlaceholder,
  dashboardUser,
  dashboardNotifications,
} from "../config/dashboardConfig";

const DashboardNav = () => {
  const location = useLocation();
  const { pathname } = location;
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => ({
    name: dashboardPathMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    path: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const { branding } = homepageConfig;
  const LogoIcon = branding.logoIcon;

  const handleLogout = () => {
    sessionStorage.removeItem("hasAuthenticated");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Breadcrumbs (left) */}
        <div className="flex items-center min-w-0">
          {breadcrumbs.length > 0 && (
            <nav
              className="flex items-center text-sm text-muted-foreground"
              aria-label="Breadcrumb">
              <Link
                to="/dashboard"
                className="hover:underline text-primary font-medium">
                Dashboard
              </Link>
              {breadcrumbs.slice(1).map((crumb, idx) => (
                <span key={crumb.path} className="flex items-center">
                  <span className="mx-2 text-gray-400">&gt;</span>
                  <Link to={crumb.path} className="hover:underline">
                    {crumb.name}
                  </Link>
                </span>
              ))}
            </nav>
          )}
        </div>
        {/* Right section: Search, Theme, Notifications, User Menu */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="w-96 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
            <input
              type="text"
              placeholder={dashboardSearchPlaceholder}
              className="w-full px-3 py-2 rounded-md border border-border dark:border-gray-700 bg-card dark:bg-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search"
            />
          </div>
          <ThemeToggle />
          <Notifications notifications={dashboardNotifications} />
          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {dashboardUser.avatarInitial}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {dashboardUser.name}
              </span>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu">
                  {dashboardUserMenuOptions.map((option) => {
                    if (option.label === "Profile") {
                      return (
                        <Link
                          key={option.label}
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted hover:text-primary transition-colors duration-200"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}>
                          {option.label}
                        </Link>
                      );
                    }
                    if (option.label === "Settings") {
                      return (
                        <Link
                          key={option.label}
                          to="/dashboard/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted hover:text-primary transition-colors duration-200"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}>
                          {option.label}
                        </Link>
                      );
                    }
                    if (option.to === "#logout") {
                      return (
                        <button
                          key={option.label}
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 hover:text-destructive transition-colors duration-200 w-full text-left"
                          role="menuitem">
                          {option.label}
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={option.label}
                        to={option.to}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted hover:text-primary transition-colors duration-200"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}>
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;
