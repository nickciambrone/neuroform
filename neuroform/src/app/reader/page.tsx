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
import SignedOutOverlay from "@/components/SignedOutOverlay";
import FullPageLoader from "@/components/FullPageLoader";

const LOCAL_STORAGE_KEY = "pdf-reader-searchTargets";

export default function AppShell() {
  const { user, loading } = useAuth(); // now available

  const [searchTargets, setSearchTargets] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const TAB_STORAGE_KEY = "pdf-reader-currentTab";

  const [tab, setTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TAB_STORAGE_KEY) || "search";
    }
    return "search";
  });

  // Whenever the tab changes, save it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch {
      // ignore errors
    }
  }, [tab]);

  // Load targets depending on auth status
  useEffect(() => {
    const loadTargets = async () => {
      if (user) {
        // Signed in: Load from Firebase
        const fetched = await fetchAllTargets(user.uid);

        if (fetched.length === 0) {
          // Create a blank target in Firebase if none exist
          const { createTarget } = await import("@/lib/firebase/searchTargets");
          const ref = await createTarget(user.uid, {
            name: "",
            description: "",
            tags: "",
          });
          setSearchTargets([ref]);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([ref]));
        } else {
          setSearchTargets(fetched);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetched));
        }
      } else {
        // Not signed in: Load from localStorage
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSearchTargets(parsed);
              return;
            }
          }
          // If no saved targets found, create one blank locally
          const blank = [{ id: null, name: "", description: "", tags: "" }];
          setSearchTargets(blank);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blank));
        } catch {
          // On parse error, just set blank one
          const blank = [{ id: null, name: "", description: "", tags: "" }];
          setSearchTargets(blank);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blank));
        }
      }
    };

    loadTargets();
  }, [user]);

  // Keep localStorage updated on every targets change
  useEffect(() => {
    if (searchTargets === null) return;
    // Always sync localStorage no matter what (for offline ready)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchTargets));
    } catch {
      // ignore localStorage errors
    }
  }, [searchTargets]);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <FullPageLoader />
      </div>
    );
  }
  
  return (
    
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">📄 PDF AI Reader</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="search">Search Targets</TabsTrigger>
          <TabsTrigger value="process">Process PDF</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <div className="relative">
          {!loading && !user && (
            <SignedOutOverlay dismissed={dismissed} setDismissed={setDismissed} />
          )}

          <div className={`${!loading && !user && !dismissed ? "pointer-events-none blur-[2px] select-none" : ""}`}>

            <TabsContent value="search">
              {searchTargets === null ? (
                <LoadingSkeleton />
              ) : (
                <SearchTargetEditor
                  targets={searchTargets}
                  setTargets={setSearchTargets}
                  setTab={setTab}
                  user={user} // pass user down to differentiate firebase/localStorage logic in SearchTargetEditor
                />
              )}
            </TabsContent>

            <TabsContent value="process">
              <ProcessPDF setTab={setTab} searchTargets={searchTargets} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            </TabsContent>

            <TabsContent value="log">
              <HistoryTable />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
