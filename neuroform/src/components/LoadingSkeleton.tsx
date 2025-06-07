import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-gray-200 dark:bg-zinc-800 h-6 w-40 rounded-md mb-2" />
        <CardDescription className="animate-pulse bg-gray-100 dark:bg-zinc-700 h-4 w-64 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 bg-gray-50 dark:bg-zinc-800 animate-pulse space-y-2"
          >
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3" />
          </div>
        ))}
        <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-700 rounded-md" />
      </CardContent>
    </Card>
  );
}
