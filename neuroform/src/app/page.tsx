"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Sparkles, FileText, PenTool, 
  Activity,
} from "lucide-react";

const apps = [
  {
    name: "AI PDF Reader",
    icon: <FileText className="h-6 w-6 text-primary" />,
    description:
      "Extract key data from PDFs using AI. Configure search targets, upload forms, and export results with ease.",
    path: "/reader",
  },
  {
    name: "PDF Writer (Coming Soon)",
    icon: <PenTool className="h-6 w-6 text-muted" />,
    description:
      "Automate form filling workflows (Coming Soon). Build on the same AI automation platform.",
    path: "/pdf-writer",
    disabled: true,
  },
];

// Dummy recent activity data
const recentActivity = [
  { id: 1, action: "Processed 3 PDFs", date: "May 16, 2025" },
  { id: 2, action: "Configured new search target", date: "May 14, 2025" },
  { id: 3, action: "Upgraded to Pro Plan", date: "May 10, 2025" },
];

export default function NeuroformHomepage() {
  const router = useRouter();

  // Dummy auth state — replace with your auth logic
  const isAuthenticated = false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col">
     

      <main className="px-6 max-w-6xl mx-auto flex-1 grid gap-8 sm:grid-cols-3">
        {/* Apps section - spans 2 cols */}
        <section className="sm:col-span-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 items-start">
          {apps.map((app, i) => (
            <Card
              key={i}
              className={`min-h-[180px] transition hover:shadow-xl cursor-pointer ${app.disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
              onClick={() => {
                if (!app.disabled) router.push(app.path);
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {app.icon}
                  <CardTitle>{app.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{app.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Activity pane */}
        <aside className="rounded-lg p-6 flex flex-col border border-gray-200 dark:border-gray-800 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <ul className="space-y-3 flex-1 overflow-auto">
            {recentActivity.map(({ id, action, date }) => (
              <li key={id} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-none">
                <p className="text-sm font-medium">{action}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </li>
            ))}
          </ul>
          {!isAuthenticated && (
            <p className="mt-4 text-xs text-muted-foreground">
              Sign in to see your full activity history.
            </p>
          )}
        </aside>

      </main>

      <footer className="mt-20 text-center px-6 py-8 border-t border-gray-200 dark:border-gray-800 max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium tracking-wide">
          <Sparkles className="h-5 w-5" />
          Empowering enterprises with AI-driven document automation for seamless operational efficiency.
        </div>
      </footer>
    </div>
  );
}
