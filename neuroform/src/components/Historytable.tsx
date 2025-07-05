"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { fetchUserLogs } from "@/lib/firebase/getUserLogs";
import { fetchUserMeta } from "@/lib/firebase/getUserMeta"; // <- import this

const KeyValuePair = ({ keyText, valueText }: { keyText: string; valueText: string }) => (
  <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 p-1">
    <span className="font-medium text-sm">{keyText}:</span>
    <span className="text-sm text-gray-800 dark:text-gray-300">{valueText}</span>
  </div>
);

export default function HistoryTable() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // <- Add this

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      const userLogs = await fetchUserLogs(user.uid);
      setLogs(userLogs);
      const meta = await fetchUserMeta(user.uid); // <- Fetch email
      setUserEmail(meta?.email || "Unknown");
    };

    fetchLogs();
  }, [user]);

  const toggleRow = (idx: number) => {
    setExpandedRow(prev => (prev === idx ? null : idx));
  };

  const downloadExtractedData = (data: object, fileName: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/, "")}_extracted_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  console.log(logs)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-2">File</th>
                <th className="p-2">Extracted Data</th>
                <th className="p-2">User</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry, idx) => (
                <tr key={entry.id} className="border-b border-gray-200 dark:border-zinc-700">
                  <td className="p-2">
                    {entry.downloadUrl ? (
                      <a href={entry.downloadUrl} className="text-blue-600 hover:underline" download>
                        {entry.fileName}
                      </a>
                    ) : (
                      entry.fileName
                    )}
                  </td>
                  <td
                    className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700"
                    onClick={() => toggleRow(idx)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        {expandedRow === idx ? "Hide Data" : "View Data"}
                      </span>
                      <div className="ml-2">
                        {expandedRow === idx ? (
                          <ChevronUp className="text-gray-500 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="text-gray-500 dark:text-gray-300" />
                        )}
                      </div>
                    </div>
                    {expandedRow === idx && (
                      <div className="mt-2 space-y-2 transition-all duration-300 ease-in-out max-h-[300px] overflow-auto">
                        {Object.entries(entry.data).map(([key, value], i) => (
                          <KeyValuePair key={i} keyText={key} valueText={String(value)} />
                        ))}
                        <button
                          onClick={() => downloadExtractedData(entry.data, entry.fileName)}
                          className="mt-4 p-3 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download Extracted Data
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2">{userEmail}</td>
                  <td className="p-2">
                    {entry.timestamp
                      ? new Date(entry.timestamp.seconds * 1000).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
