export default function Skeleton({ height = null, width = null, variant = 'post', classes = '' }) {
  if (variant === 'post') {
    return (
      <div
        className={`animate-pulse rounded-lg border border-gray-200 p-4 shadow-sm space-y-3 ${classes}`}
        style={{ height, width }}
      >
        <div className="h-35 w-full rounded-md bg-gray-300"></div>
        <div className="h-5 w-3/4 rounded bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-300"></div>
          <div className="h-4 w-5/6 rounded bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          <div className="h-4 w-1/3 rounded bg-gray-300"></div>
        </div>
      </div>
    );
  }

  if (variant === 'comment') {
    return (
      <div
        className={`flex flex-col justify-center animate-pulse rounded-lg border border-gray-200 p-4 shadow-sm space-y-3 ${classes}`}
        style={{ height, width }}
      >
        <div className="h-3 w-20 rounded-md bg-gray-300 mb-3"></div>
        <div className="h-2 w-full rounded-md bg-gray-300"></div>
        <div className="h-2 w-full rounded-md bg-gray-300"></div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse rounded-xl bg-gray-300 ${classes}`} style={{ height, width }} />
  );
}
