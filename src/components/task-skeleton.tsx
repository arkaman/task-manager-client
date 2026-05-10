import { Skeleton } from "@/components/ui/skeleton"

export default function TaskSkeleton() {
    return (
        <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    )
}