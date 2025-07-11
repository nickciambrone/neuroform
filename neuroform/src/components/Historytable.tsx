"use client";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { fetchUserLogs } from "@/lib/firebase/getUserLogs";
import { fetchUserMeta } from "@/lib/firebase/getUserMeta";

const LOCAL_STORAGE_KEY = "pdf-reader-userLogs";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      if (user) {
        // Signed in: fetch logs + user email from Firebase
        const userLogs = await fetchUserLogs(user.uid);
        setLogs(userLogs);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userLogs)); // keep local copy for offline fallback

        const meta = await fetchUserMeta(user.uid);
        setUserEmail(meta?.email || "Unknown");
      } else {
        // Not signed in: load from localStorage or empty
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log(parsed)
              setLogs(parsed);
              setUserEmail("Anonymous");
              return;
            }
          }
          console.log('this fired')
          setLogs([]);
          setUserEmail("Anonymous");
        } catch {
          setLogs([]);
          setUserEmail("Anonymous");
        }
      }
    };

    loadLogs();
  }, [user]);



  const toggleRow = (idx: number) => {
    setExpandedRow((prev) => (prev === idx ? null : idx));
  };

  const downloadExtractedData = (data: Record<string, any>, fileName: string) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const csv = `${keys.join(",")}\n${values.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/, "")}_extracted_data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const downloadFullLogAsCSV = () => {
    if (!logs.length) return;
  
    const headers = ["File Name", "Extracted Data", "User", "Date"];
  
    const rows = logs.map((entry) => {
      const fileName = entry.fileName;
      const extractedData = Object.entries(entry.data || {})
        .map(([k, v]) => `${k}: ${String(v).replace(/\n/g, " ").trim()}`)
        .join("; ");
      const user = userEmail || "Unknown";
      const date = entry.timestamp
        ? new Date(entry.timestamp.seconds * 1000).toLocaleDateString()
        : "";
  
      return [
        `"${fileName}"`,
        `"${extractedData.replace(/"/g, '""')}"`,
        `"${user}"`,
        `"${date}"`,
      ];
    });
  
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "full_log.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  


  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing History</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-center py-10 text-gray-500 dark:text-gray-400">
            {user ? "No processing history found." : "No logs found. Sign in to see your history."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadFullLogAsCSV}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 shadow-sm"
              >
                <Download size={16} />
                Download Full Log as CSV
              </button>
            </div>

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
                  <tr key={entry.id || idx} className="border-b border-gray-200 dark:border-zinc-700">
                    <td className="p-2">
                      <button
                        onClick={async () => {
                          if (!user){return}
                          try {
                            const storage = getStorage();
                            const fileRef = ref(storage, `users/${user?.uid}/pdfs/${entry.fileName}`);
                            const url = await getDownloadURL(fileRef);

                            const link = document.createElement("a");
                            link.href = url;
                            link.download = entry.fileName;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (err) {
                            console.error("Failed to download file", err);
                            alert("Download failed. File may not exist or you're not authorized.");
                          }
                        }}
                        className={user ? "text-blue-600 hover:underline" : ''}
                      >
                        {entry.fileName.split("_").slice(1).join("_")}
                      </button>
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
                      {expandedRow === idx && entry.data && (
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
                    <td className="p-2">{userEmail || "Unknown"}</td>
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
        )}
      </CardContent>
    </Card>
  );
}
