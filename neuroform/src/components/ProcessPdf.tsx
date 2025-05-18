"use client";

import { useState } from "react";
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
import { UploadCloud, X } from "lucide-react";

export default function ProcessPDF({ onSubmit, setTab }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExisting, setSelectedExisting] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const uploadedFiles = ["report_q1.pdf", "invoice_2023.pdf", "contract_signed.pdf"];

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
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
    };

    setTimeout(() => {
      setExtractedData(mockExtracted);
      // onSubmit(file); // don’t navigate yet — wait for user action
    }, 600);
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
            <h3 className="text-xl font-semibold mb-4">Extracted Data</h3>

            {/* Data Table */}
            <div className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800 text-sm space-y-2">
              {Object.entries(extractedData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">{key}</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-100">
                    {value}
                  </span>
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
              <Button onClick={() => setTab("history")}>View Full History</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
