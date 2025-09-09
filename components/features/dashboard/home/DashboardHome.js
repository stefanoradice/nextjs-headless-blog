'use client';

import { useAuth } from '@/context/AuthContext';
import { PostBookmarkedChart } from '../analytics/PostBookmarkedChart';

export default function DashboardHome() {
  const { user } = useAuth();
  return (
    <>
      <h1>Benvenuto nella tua Dashboard {user.name}!</h1>
      <p>Contenuto privato visibile solo agli utenti loggati.</p>
      <section className="p-4 bg-white rounded-lg shadow-sm">
        <PostBookmarkedChart />
      </section>
    </>
  );
}
