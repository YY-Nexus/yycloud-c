import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-row md:flex-col gap-3">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
            ))}
        </div>

        <Skeleton className="flex-1 h-[400px] rounded-lg" />
      </div>
    </div>
  )
}
