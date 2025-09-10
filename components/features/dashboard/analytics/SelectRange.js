import { useRangeStore } from '@/store/rangeStore';

function SelectRange(initialRange = '30d') {
  const { range, ranges, setRange } = useRangeStore();

  return (
    <div className="flex gap-2">
      {ranges.map((r, i) => (
        <button
          onClick={() => setRange(r.id)}
          aria-pressed={r.id === range}
          className={`px-3 py-1 rounded-md text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            r.id === r
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
          key={r.id}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default SelectRange;
