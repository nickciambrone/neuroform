// components/ProcessPDF.tsx
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProcessPDF({ onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload or Select a PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
        <Button
          disabled={!selectedFile}
          onClick={() => onSubmit(selectedFile)}
          className="w-full"
        >
          Process PDF
        </Button>
      </CardContent>
    </Card>
  );
}
