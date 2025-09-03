'use client';
import { useAuth } from '@/context/AuthContext';

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Caricamento...</p>;
  if (!user) return <p>Accesso negato</p>;

  return children;
}
