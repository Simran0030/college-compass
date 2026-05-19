import { Skeleton } from '@/components/ui/skeleton';

export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <Skeleton className="h-5 w-16 rounded-full mb-2" />
      <Skeleton className="h-5 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-4 w-24 mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-10 rounded-lg" />
      </div>
    </div>
  );
}
