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

export default function ProcessPDF({ onSubmit, setTab }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExisting, setSelectedExisting] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  // Initializing search targets with selected state and fileType
  const [searchTargets, setSearchTargets] = useState([
    { name: "Invoice Number", fileType: "Invoice", value: "01221", selected: true },
    { name: "Total Amount", fileType: "Invoice", value: 40000, selected: true },
    { name: "Customer Name", fileType: "Invoice", value: "Nick Smith", selected: true },
    { name: "Due Date", fileType: "Tax Waiver", value: "2025-06-01", selected: true },
  ]);

  // Slicers selection
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]); // Slicers deselected by default

  const uploadedFiles = ["report_q1.pdf", "invoice_2023.pdf", "contract_signed.pdf"];

  // Hook to handle updating selected targets when slicers change
  useEffect(() => {
    setSearchTargets((prev) =>
      prev.map((target) => {
        // If no slicers are selected, select all by default
        if (selectedFileTypes.length === 0) {
          return { ...target, selected: true };
        }
        // If target's file type is in selectedFileTypes, select it; otherwise, deselect
        return {
          ...target,
          selected: selectedFileTypes.includes(target.fileType),
        };
      })
    );
  }, [selectedFileTypes]);

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

  const handleProcess = () => {
    const file = selectedFile || selectedExisting;
    if (!file) return;

    const mockExtracted = {
      "Invoice Number": "INV-2024-0098",
      "Total Amount": "$1,320.50",
      "Customer Name": "Acme Corp",
      "Due Date": "2025-06-01",
      "File Type": "Invoice", // All are of type "Invoice" for this example
    };

    setTimeout(() => {
      setExtractedData(mockExtracted);
    }, 600);
  };

  const handleFileTypeSelection = (type: string) => {
    if (selectedFileTypes.includes(type)) {
      // Deselect the slicer (remove it from selectedFileTypes)
      setSelectedFileTypes((prev) => prev.filter((t) => t !== type));
    } else {
      // If slicer is selected, add it to the selectedFileTypes
      setSelectedFileTypes((prev) => [...prev, type]);
    }
  };

  const handleFieldSelection = (key: string) => {
    setSearchTargets((prev) =>
      prev.map((target) =>
        target.name === key ? { ...target, selected: !target.selected } : target
      )
    );
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
              {uploadedFiles.map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => handleExistingSelect(fileName)}
                  className={cn(
                    "text-left px-4 py-2 rounded-md border text-sm transition",
                    selectedExisting === fileName
                      ? "border-black bg-zinc-100 dark:bg-zinc-700 dark:border-white"
                      : "border-zinc-300 hover:border-black dark:hover:border-white"
                  )}
                >
                  {fileName}
                </button>
              ))}
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
            
            <h3 className="text-xl font-semibold mb-4">Extracted Data for {selectedExisting ? selectedExisting : selectedFile.name}</h3>

            {/* Slicer - File Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">
              Select which search targets you want to download or save to the log. You can also select search targets based on File Type using the selectors.              </label>
              <div className="flex flex-wrap gap-4">
                {["Invoice", "Tax Waiver", "Legal Notice"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFileTypeSelection(type)}
                    className={cn(
                      "px-4 py-2 border rounded-md text-sm transition",
                      selectedFileTypes.includes(type)
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-700"
                        : "border-zinc-300 hover:border-black dark:hover:border-white"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800 text-sm space-y-2">
              {searchTargets.map((target) => (
                <div
                  key={target.name}
                  className={cn(
                    "flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2",
                    !target.selected
                      ? "opacity-50" // Ghosting the target if it doesn't match the slicer
                      : ""
                  )}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={target.selected || false}
                      onChange={() => handleFieldSelection(target.name)}
                      className="w-4 h-4"
                    />
                    <span className="text-zinc-500 dark:text-zinc-400">{target.name}</span>
                  </label>
                  {target.selected && (
                    <span className="font-medium text-zinc-800 dark:text-zinc-100">{target.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => alert("Download coming soon")}
              >
                Download Data
              </Button>
              <Button
                onClick={() => setTab("log")}
                className="flex items-center gap-2"
              >
                <Save size={16} /> {/* Floppy disk icon */}
                Record to log
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
