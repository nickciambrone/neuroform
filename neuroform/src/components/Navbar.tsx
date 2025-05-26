"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center bg-white dark:bg-black">
      <Link href="/" className="text-xl font-semibold">
        Neuroform
      </Link>
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button size="sm" onClick={() => signOut(auth)}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button size="sm" variant="default" className="rounded-full px-5 font-semibold">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-5 font-semibold border-black dark:border-white"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
