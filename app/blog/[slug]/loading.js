import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Skeleton variant="layout" height={24} width={190} classes="breadcrumbs" />
      <Skeleton variant="layout" height={45} classes="text-4xl font-bold leading-tight mb-4 mt-2" />
      <Skeleton
        variant="layout"
        height={20}
        width={70}
        classes="flex justify-between text-sm text-gray-500 mb-6"
      />
      <Skeleton
        variant="layout"
        height={350}
        classes="rounded-lg object-cover w-full h-auto mb-5"
      />
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          variant="layout"
          height={16}
          classes="rounded-lg object-cover w-full h-auto mt-2"
        />
      ))}

      <ul className="flex flex-col gap-4 mt-9">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="comment" height={90} />
        ))}
      </ul>
    </main>
  );
}
