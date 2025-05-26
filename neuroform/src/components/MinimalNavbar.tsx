import Link from "next/link";

export default function MinimalNavbar() {
  return (
    <nav className="w-full border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex justify-start items-center bg-white dark:bg-black">
      <Link href="/" className="text-xl font-semibold">
        Neuroform
      </Link>
    </nav>
  );
}
