import { Link, useLocation } from "react-router-dom";
import { homepageConfig } from "../config/homepageConfig";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

const Navbar = () => {
  const { navTabs, branding, navbar } = homepageConfig;
  const LogoIcon = branding.logoIcon;
  const location = useLocation();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Match the route with tab name
  useEffect(() => {
    const path = location.pathname === "/" ? "" : location.pathname.slice(1);
    const idx = navTabs.findIndex(
      (tab) => path.toLowerCase() === tab.toLowerCase().replace(/\s+/g, "-")
    );
    setActiveIndex(idx === -1 ? 0 : idx);
  }, [location.pathname, navTabs]);

  // Active tab style
  useLayoutEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  // Hover style
  useLayoutEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 mr-6">
            <div className="p-1 rounded-lg gradient-accent">
              <LogoIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {branding.appName}
            </span>
          </Link>
          <nav className="flex items-center">
            <div className="relative">
              {/* Hover Highlight */}
              <div
                className="absolute h-[30px] transition-all duration-300 ease-out gradient-accent rounded-[6px] flex items-center"
                style={{
                  ...hoverStyle,
                  opacity: hoveredIndex !== null ? 1 : 0,
                }}
              />
              {/* Active Indicator */}
              {/* Tabs */}
              <div className="relative flex space-x-[6px] items-center">
                {navTabs.map((tab, index) => {
                  const tabPath =
                    index === 0
                      ? "/"
                      : `/${tab.toLowerCase().replace(/\s+/g, "-")}`;
                  return (
                    <Link
                      key={index}
                      to={tabPath}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] rounded-md ${
                        index === activeIndex
                          ? "text-primary dark:text-primary/80 font-medium"
                          : "text-[#0e0f1199] dark:text-[#ffffff99] hover:text-primary"
                      }`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}>
                      <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                        {tab}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Link
            to={navbar.signIn.to}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-blue-900/20">
            {navbar.signIn.label}
          </Link>
          <Link to={navbar.getStarted.to}>
            <Button className="btn-primary h-9 px-4 rounded-md font-medium">
              {navbar.getStarted.label}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
