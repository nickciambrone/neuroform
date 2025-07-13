"use client";

import { Loader2 } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">Initializing app…</p>
    </div>
  );
}
