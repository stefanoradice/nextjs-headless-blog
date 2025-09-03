'use client';
import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-500 font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/comments"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              I miei commenti
            </Link>
          </li>
          <li>
            <Link href="/dashboard/posts" className="text-gray-700 hover:text-blue-500 font-medium">
              I miei articoli salvati
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
