"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchTargetEditor from "@/components/Searchtargeteditor";
import ProcessPDF from "@/components/ProcessPdf";
import HistoryTable from "@/components/Historytable";
import { toast } from "sonner";
import { fetchAllTargets } from "@/lib/firebase/searchTargets";
import { useAuth } from "@/components/AuthContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AppShell() {
  const [tab, setTab] = useState("search");
  const { user } = useAuth();

  const [searchTargets, setSearchTargets] = useState(null);

  const [lastProcessed, setLastProcessed] = useState(null);

  useEffect(() => {
    const loadTargets = async () => {
      if (!user) return;
      const fetched = await fetchAllTargets(user.uid);

      if (fetched.length === 0) {
        const { createTarget } = await import("@/lib/firebase/searchTargets");
        const ref = await createTarget(user.uid, {
          name: "",
          description: "",
          tags: "",
        });
        setSearchTargets([ref]);
      } else {
        setSearchTargets(fetched);
      }

    };

    loadTargets();
  }, [user]);


  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">📄 PDF AI Reader</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="search">Search Targets</TabsTrigger>
          <TabsTrigger value="process">Process PDF</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          {searchTargets === null ? (
            <LoadingSkeleton />
          ) : (
            <SearchTargetEditor
              targets={searchTargets}
              setTargets={setSearchTargets}
              setTab={setTab}
            />
          )}
        </TabsContent>

        <TabsContent value="process">
          <ProcessPDF
    
            setTab={setTab}
            searchTargets={searchTargets}
          />
        </TabsContent>

        <TabsContent value="log">
          <HistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
