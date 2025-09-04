import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Archivio Blog</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 h-full">
          <Skeleton height={306} variant="layout" />
        </aside>

        <section className="lg:col-span-3">
          <ul className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
