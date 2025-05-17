// components/ui/card.jsx
import React from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => (
  <div className={cn("mb-2", className)}>{children}</div>
);

export const CardTitle = ({ className, children }) => (
  <h3 className={cn("text-xl font-semibold tracking-tight", className)}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children }) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

export const CardContent = ({ className, children }) => (
  <div className={cn("mt-2", className)}>{children}</div>
);
