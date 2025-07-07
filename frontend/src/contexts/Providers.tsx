import * as React from "react";
import { ThemeProvider } from "./theme-context";
import { TooltipProvider } from "../components/ui/tooltip";

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
  </ThemeProvider>
);

export default Providers;
