"use client";

import React, { useState } from "react";
import { Bell, X, Info, TrendingUp, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { NotificationItem } from "../config/dashboardConfig";

export function Notifications({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-muted hover:text-primary transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50 shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Notifications
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
              className="h-6 w-6 hover:bg-muted">
              <X className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="p-2 space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-border">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-1.5 rounded-full ${notification.color.replace(
                          "text-",
                          "bg-"
                        )} bg-opacity-10`}>
                        {React.createElement(notification.icon, {
                          className: `h-3.5 w-3.5 ${notification.color}`,
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
