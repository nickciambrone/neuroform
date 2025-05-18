// components/HistoryTable.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const mockData = [
  {
    fileName: "Invoice_1234.pdf",
    extracted: { invoiceNumber: "1234", amount: "$500" },
    user: "jane@company.com",
    date: "2025-05-17",
    downloadUrl: "/invoices/1234.pdf"
  },
  // More rows...
];

export default function HistoryTable() {
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
                  <td className="p-2 whitespace-pre-wrap">
                    {Object.entries(entry.extracted)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join("\n")}
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
