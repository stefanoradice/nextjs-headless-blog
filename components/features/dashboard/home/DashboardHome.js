'use client';

import { useAuth } from '@/context/AuthContext';
import { UserPostChart } from '../analytics/UserPostChart';
import SelectRange from '../analytics/SelectRange';
import { useRangeStore } from '@/store/rangeStore';

export default function DashboardHome() {
  const { user } = useAuth();
  const { range } = useRangeStore();

  return (
    <>
      <h1>Benvenuto nella tua Dashboard {user.name}!</h1>

      <>
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">I miei dati</h2>
          <SelectRange />
        </header>
        <main className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UserPostChart range={range} type="comments" title="Commenti lasciati" />
          <UserPostChart range={range} type="bookmarked" title="Articoli preferiti" />
        </main>
      </>
    </>
  );
}
