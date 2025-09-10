import convertDate from '@/lib/utils/convertDate';
import { useRangeStore } from '@/store/rangeStore';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function generateDateRange(range) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const today = new Date();
  const dates = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
  }

  return dates;
}

async function fetchMetrics(range = '30d', type) {
  const res = await fetch(`/api/dashboard/metrics?range=${range}&type=${type}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Errore nel recupero metriche');
  }
  return res.json();
}

export const UserPostChart = ({ initialRange = '30d', range, type = 'bookmarked', title }) => {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['dashboard-metrics', type, range],
    queryFn: () => fetchMetrics(range, type),
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
  });

  const favoritesData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const convertedDates = generateDateRange(range).map((element) => {
      const dateFound = data?.find((bookmarked) => bookmarked.day === element);
      const newDate = new Date(element);
      return { date: convertDate(newDate), count: dateFound ? dateFound.count : 0 };
    });

    return convertedDates;
  }, [data]);

  return (
    <section className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
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
              layout="horizontal" // default
              margin={{ top: 5, right: 12, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" type="category" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name={type} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Aggiornamento: {isFetching ? 'in corso...' : 'ok'}
      </div>
    </section>
  );
};
