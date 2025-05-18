"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchTargetEditor from "@/components/Searchtargeteditor";
import ProcessPDF from "@/components/ProcessPdf";
import HistoryTable from "@/components/Historytable";
import { toast } from "sonner";

export default function AppShell() {
  const [tab, setTab] = useState("search");
  const [searchTargets, setSearchTargets] = useState([
    { name: "", description: "" },
  ]);
  const [lastProcessed, setLastProcessed] = useState(null);

  const handlePDFProcessed = (file) => {
    setLastProcessed(file);
    toast.success("PDF processed successfully");
    setTab("history");
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">📄 PDF AI Reader</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="search">1. Search Targets</TabsTrigger>
          <TabsTrigger value="process">2. Process PDF</TabsTrigger>
          <TabsTrigger value="history">3. History</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <SearchTargetEditor
            targets={searchTargets}
            setTargets={setSearchTargets}
            setTab={setTab}
          />
  
        </TabsContent>

        <TabsContent value="process">
          <ProcessPDF
            onSubmit={(file) => {
              console.log("Processing PDF with:", searchTargets, file);
              // simulate processing
              setTimeout(() => handlePDFProcessed(file), 1000);
            }}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
