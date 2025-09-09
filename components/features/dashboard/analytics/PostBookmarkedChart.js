import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ranges = [
  { id: '7d', label: '7 giorni' },
  { id: '30d', label: '30 giorni' },
  { id: '90d', label: '90 giorni' },
];

async function fetchMetrics(range = '30d') {
  const res = await fetch(`/api/dashboard/metrics?range=${range}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Errore nel recupero metriche');
  }
  return res.json();
}

export const PostBookmarkedChart = ({ initialRange = '30d', initialData = null }) => {
  const [range, setRange] = useState(initialRange);
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['dashboard-metrics', range],
    queryFn: () => fetchMetrics(range),
    initialData: {
      initialData,
      staleTime: 1000 * 60 * 2,
      keepPreviousData: true,
    },
  });

  const favoritesData = useMemo(() => data?.favorites || [], [data]);

  return (
    <>
      <h3 className="text-sm font-medium mb-2">Post preferiti</h3>
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">Caricamento...</div>
        ) : favoritesData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            Nessun post preferito ancora
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={favoritesData}
              layout="vertical"
              margin={{ top: 5, right: 12, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={160} />
              <Tooltip />
              <Bar dataKey="count" name="Bookmarks" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Aggiornamento: {isFetching ? 'in corso...' : 'ok'}
      </div>
    </>
  );
};
