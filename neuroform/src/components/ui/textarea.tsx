import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";
