// components/HistoryTable.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const mockData = [
  {
    fileName: "Invoice_1234.pdf",
    extracted: {
      invoiceNumber: "1234",
      amount: "$500",
      clientName: "John Doe",
      dueDate: "2025-06-01",
      paymentStatus: "Paid",
      // More fields here...
    },
    user: "jane@company.com",
    date: "2025-05-17",
    downloadUrl: "/invoices/1234.pdf"
  },
  // More rows...
];

const KeyValuePair = ({ keyText, valueText }: { keyText: string, valueText: string }) => (
  <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 p-1">
    <span className="font-medium text-sm">{keyText}:</span>
    <span className="text-sm text-gray-800 dark:text-gray-300">{valueText}</span>
  </div>
);

export default function HistoryTable() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (idx: number) => {
    setExpandedRow(prev => (prev === idx ? null : idx));
  };

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
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((entry, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-zinc-700">
                  <td className="p-2">{entry.fileName}</td>
                  <td
                    className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700"
                    onClick={() => toggleRow(idx)} // Click only on the cell to toggle
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        {expandedRow === idx ? 'Hide Data' : 'View Data'}
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
                        {Object.entries(entry.extracted).map(([key, value], i) => (
                          <KeyValuePair key={i} keyText={key} valueText={String(value)} />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-2">{entry.user}</td>
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">
                    <a href={entry.downloadUrl} className="text-blue-600 hover:underline">
                      Download
                    </a>
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
