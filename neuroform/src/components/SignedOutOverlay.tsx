import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignedOutOverlay({dismissed, setDismissed}:any) {
  const router = useRouter();

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] dark:bg-black/60">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl px-8 py-10 text-center w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Log in or sign up to get smarter responses, upload files and images, and more.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="w-full mb-3 py-2 rounded-full bg-black text-white font-medium text-sm hover:bg-zinc-800 transition"
        >
          Log in
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="w-full py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-black dark:text-white text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          Sign up for free
        </button>

        <button
          className="mt-4 text-xs underline text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition"
          onClick={() => setDismissed(true)}
        >
          Stay logged out
        </button>
      </div>
    </div>
  );
}
