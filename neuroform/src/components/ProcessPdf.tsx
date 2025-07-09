"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UploadCloud, X, Save } from "lucide-react"; // Import Save (floppy disk) icon
import { savePDFForUser } from "@/lib/firebase/uploadPDF";
import { useAuth } from "@/components/AuthContext";
import { listUserFiles } from "@/lib/firebase/listUserFiles";
import { format } from "date-fns";
import { recordExtractionLog } from "@/lib/firebase/recordExtractionLog";

export default function ProcessPDF({ setTab, searchTargets }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExisting, setSelectedExisting] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [usedSearchTargets, setUsedSearchTargets] = useState(searchTargets);
  const [showAllFiles, setShowAllFiles] = useState(false);

  // Slicers selection
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]); // Slicers deselected by default

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const files = await listUserFiles(user.uid);
        setUploadedFiles(files);
      } catch (err) {
        console.error("Error loading uploaded files:", err);
      }
    };

    fetchFiles();
  }, [user]);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    console.log(file);
    setSelectedFile(file);
    setSelectedExisting(null);
  };

  const handleExistingSelect = (fileName: string) => {
    setSelectedExisting(fileName);
    setSelectedFile(null);
  };

  const handleProcess = async () => {
    const fileToProcess = selectedFile;

    setIsLoading(true);
    //


      if (user && selectedFile && !selectedExisting) {
        await savePDFForUser(user.uid, selectedFile);
      }
    //

    try {
      let file: File | null = fileToProcess;

      // If user selected an existing file from Firebase
      if (!file && selectedExisting && user) {
        const storage = (await import("firebase/storage")).getStorage;
        const { ref, getBlob } = await import("firebase/storage");
        const storageRef = ref(storage(), `users/${user.uid}/pdfs/${selectedExisting}`);
        const blob = await getBlob(storageRef);

        // Recreate a File object from the Blob
        file = new File([blob], selectedExisting, { type: "application/pdf" });
      }

      if (!file) return;

      let extractionPrompt =
        "Your task is to extract the following information from the PDF provided and return the data in JSON format like search_target_name:search_target_value. If the value is not there, just return not found. Here are the search targets:\n";

      for (const target of searchTargets) {
        extractionPrompt += `Search target 1 name::${target.name}\n`;
        extractionPrompt += `Search target 1 description::${target.description}\n`;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", extractionPrompt);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Extracted data:", data);
      setExtractedData(JSON.parse(data.result));
    } catch (err) {
      alert(err)
      console.error("Error calling extract API:", err);
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload or Select a PDF</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            You can either upload a new PDF file or choose one you've uploaded before.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Upload new PDF
            </label>
            <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-6 flex items-center justify-center text-center hover:border-black transition group cursor-pointer">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleUploadChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-black dark:group-hover:text-white transition">
                <UploadCloud size={24} />
                <span className="text-sm">
                  {selectedFile
                    ? selectedFile.name
                    : "Click or drag a PDF file here to upload"}
                </span>
              </div>
            </div>
          </div>

          {/* Process Button */}
          <div className="pt-2 mb-2">
            <Button
              disabled={!selectedFile && !selectedExisting}
              onClick={handleProcess}
              className="w-full text-base font-semibold"
            >
              Process PDF
            </Button>
          </div>

          <div className="text-center text-zinc-400 text-xs uppercase tracking-wide pt-2 mb-1">
            or select from previously uploaded
          </div>

          {/* Existing PDF List */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Select a previous PDF
            </label>
            <div className="flex flex-col gap-2">
              {(showAllFiles ? uploadedFiles : uploadedFiles.slice(0, 5)).map((file) => (
                <button
                  key={file.fullPath}
                  onClick={() => handleExistingSelect(file.originalName)}
                  className={cn(
                    "text-left px-4 py-2 rounded-md border text-sm transition",
                    selectedExisting === file.originalName
                      ? "border-black bg-zinc-100 dark:bg-zinc-700 dark:border-white"
                      : "border-zinc-300 hover:border-black dark:hover:border-white"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-zinc-500">
                      {format(new Date(file.timeCreated), "MMM d, yyyy")} · {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </button>
              ))}

              {uploadedFiles.length > 5 && (
                <button
                  onClick={() => setShowAllFiles(!showAllFiles)}
                  className="text-sm text-blue-600 dark:text-blue-400 mt-2 underline self-start"
                >
                  {showAllFiles ? "Show Less" : `Show All (${uploadedFiles.length})`}
                </button>
              )}
            </div>

          </div>

        </CardContent>
      </Card>

      {/* Extracted Data Pane */}
      {extractedData && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center px-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 animate-in fade-in slide-in-from-bottom duration-300">
            {/* Close Button */}
            <button
              onClick={() => setExtractedData(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <X size={20} />
            </button>

            {/* Title */}

            <h3 className="text-xl font-semibold mb-4">
              Extracted Data for {(selectedExisting ?? selectedFile.name).split("_").slice(1).join("_")}
            </h3>

            {/* Slicer - File Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">
                Select which search targets you want to download or save to the log.</label>

            </div>

            {/* Data Table */}
            {/* Data Table for extractedData */}
            {/* Data Table for extractedData with checkbox toggles */}
            <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800 text-sm space-y-2">
              {Object.entries(extractedData).map(([key, value]) => {
                const isSelected = extractedData[key]?.selected !== false;

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2",
                      !isSelected && "opacity-50"
                    )}
                  >
                    <label className="flex items-center gap-2 w-full">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setExtractedData((prev) => ({
                            ...prev,
                            [key]: {
                              value: typeof value === "object" ? value.value : value,
                              selected: !isSelected,
                            },
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-zinc-500 dark:text-zinc-400">{key}</span>
                    </label>
                    {isSelected && (
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
                        {typeof value === "object" ? value.value : value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>


            {/* Actions */}
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  const selectedEntries = Object.entries(extractedData).filter(
                    ([_, val]) => (typeof val === "object" ? val.selected !== false : true)
                  );

                  const csvContent =
                    "data:text/csv;charset=utf-8," +
                    selectedEntries
                      .map(([key, val]) => {
                        const value = typeof val === "object" ? val.value : val;
                        return `"${key}","${value}"`;
                      })
                      .join("\n");

                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "extracted_data.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Data
              </Button>

              <Button
                onClick={async () => {
                  // Prepare cleaned data (selected only)
                  const selectedEntries = Object.entries(extractedData).filter(
                    ([_, val]) => (typeof val === "object" ? val.selected !== false : true)
                  );

                  const cleanedData: Record<string, string> = {};
                  for (const [key, val] of selectedEntries) {
                    cleanedData[key] = typeof val === "object" ? val.value : val;
                  }

                  if (user) {
                    // Signed in: Save to Firebase log
                    try {
                      await recordExtractionLog(
                        user.uid,
                        selectedExisting || selectedFile?.name || "unknown_file.pdf",
                        cleanedData
                      );
                      setTab("log"); // switch to log tab
                    } catch (err) {
                      console.error("Error saving log:", err);
                    }
                  } else {
                    // NOT signed in: save to localStorage logs array
                    console.log('else fired')
                    try {
                      const LOCAL_LOGS_KEY = "pdf-reader-userLogs";
                      const saved = localStorage.getItem(LOCAL_LOGS_KEY);
                      const existingLogs = saved ? JSON.parse(saved) : [];
                      
                      // Create new log entry, include minimal info and timestamp
                      const newLogEntry = {
                        id: Date.now(), // unique enough for local
                        fileName: selectedExisting || selectedFile?.name || "unknown_file.pdf",
                        data: cleanedData,
                        timestamp: { seconds: Math.floor(Date.now() / 1000) },
                        downloadUrl: null,
                      };

                      const updatedLogs = [newLogEntry, ...existingLogs];
                      console.log(JSON.stringify(updatedLogs));
                      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updatedLogs));

                      setTab("log"); // switch to log tab
                    } catch (e) {
                      console.error("Error saving log to localStorage:", e);
                    }
                  }
                }}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Record to log
              </Button>


            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            <div className="text-white text-lg font-semibold tracking-wide">Analyzing PDF with AI...</div>
          </div>
        </div>
      )}

    </>
  );
}
