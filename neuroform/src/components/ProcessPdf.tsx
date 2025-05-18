// components/ProcessPDF.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, UploadCloud } from "lucide-react";

export default function ProcessPDF({ onSubmit }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExisting, setSelectedExisting] = useState<string | null>(null);

  // Placeholder for existing files. Replace with actual data.
  const uploadedFiles = ["report_q1.pdf", "invoice_2023.pdf", "contract_signed.pdf"];

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setSelectedExisting(null); // clear selection
  };

  const handleExistingSelect = (fileName: string) => {
    setSelectedExisting(fileName);
    setSelectedFile(null); // clear file upload
  };

  const handleProcess = () => {
    if (selectedFile) return onSubmit(selectedFile);
    if (selectedExisting) return onSubmit(selectedExisting);
  };

  return (
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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Upload new PDF</label>
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
                {selectedFile ? selectedFile.name : "Click or drag a PDF file here to upload"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center text-zinc-400 text-sm uppercase">or</div>

        {/* Existing PDF List */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Select a previous PDF</label>
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

        {/* Submit */}
        <Button
          disabled={!selectedFile && !selectedExisting}
          onClick={handleProcess}
          className="w-full"
        >
          Process PDF
        </Button>
      </CardContent>
    </Card>
  );
}
