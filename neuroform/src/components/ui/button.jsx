// components/ui/button.jsx
import { cn } from "@/lib/utils"; // Utility to combine class names
import React from "react";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-black text-white hover:bg-zinc-800",
      outline: "border border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
      subtle: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
