'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Processor', href: '/processor' },
  { name: 'Targets', href: '/targets' },
  { name: 'History', href: '/history' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-6 text-2xl font-semibold text-gray-900">DocAI</div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-2 rounded-md transition ${
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
