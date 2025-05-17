"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileSearch, FileText, History } from "lucide-react";

export default function ReaderHome() {
  const [activeSection, setActiveSection] = useState<"config" | "process" | "history">("config");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white max-w-6xl mx-auto p-6 flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          AI PDF Reader
        </h1>
        <nav className="flex space-x-4">
          <Button
            variant={activeSection === "config" ? "default" : "ghost"}
            onClick={() => setActiveSection("config")}
          >
            Configure Search
          </Button>
          <Button
            variant={activeSection === "process" ? "default" : "ghost"}
            onClick={() => setActiveSection("process")}
          >
            Process Forms
          </Button>
          <Button
            variant={activeSection === "history" ? "default" : "ghost"}
            onClick={() => setActiveSection("history")}
          >
            History
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {activeSection === "config" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                Configure Search Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder: Your search target config UI goes here */}
              <p className="text-muted-foreground">
                Configure which PDF fields and data you want to extract.
              </p>
            </CardContent>
          </Card>
        )}

        {activeSection === "process" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Process Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder: Your form upload and processing UI goes here */}
              <p className="text-muted-foreground">
                Upload your PDF forms and trigger the AI extraction process.
              </p>
            </CardContent>
          </Card>
        )}

        {activeSection === "history" && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Processing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder: Your processed document history UI goes here */}
              <p className="text-muted-foreground">
                Review previously processed documents and extracted data.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
