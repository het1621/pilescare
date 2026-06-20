/**
 * Reusable skeleton / shimmer building blocks.
 * Usage: import { Skeleton, SkeletonText, ServiceCardSkeleton, BlogCardSkeleton } from "./Skeleton";
 */

/** Base shimmer block */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] rounded-lg ${className}`}
      style={{
        animation: "shimmer 1.6s ease-in-out infinite",
        backgroundSize: "400% 100%",
      }}
    />
  );
}

/** Multiple lines of text skeleton */
export function SkeletonText({ lines = 3, className = "" }) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"];
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

/** Service card skeleton (used in home page horizontal scroll) */
export function ServiceCardSkeleton() {
  return (
    <div className="shrink-0 w-72 rounded-3xl bg-white border border-gray-100 p-7 space-y-4 shadow-sm">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="h-5 w-2/3" />
      <SkeletonText lines={2} />
      <Skeleton className="h-4 w-1/3 mt-6" />
    </div>
  );
}

/** Service row skeleton (used in Services page) */
export function ServiceRowSkeleton() {
  return (
    <div className="card-soft p-8 lg:p-12 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-5">
        <Skeleton className="aspect-square rounded-2xl w-full" />
      </div>
      <div className="md:col-span-7 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <SkeletonText lines={3} />
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="h-11 w-48 rounded-full mt-4" />
      </div>
    </div>
  );
}

/** Blog card skeleton */
export function BlogCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-7 w-4/5" />
      <Skeleton className="h-7 w-3/5" />
      <SkeletonText lines={2} />
    </div>
  );
}

/** Blog featured post skeleton */
export function BlogFeaturedSkeleton() {
  return (
    <div className="grid lg:grid-cols-12 gap-8 items-center card-soft p-6 lg:p-8">
      <div className="lg:col-span-7">
        <Skeleton className="w-full h-64 lg:h-96 rounded-2xl" />
      </div>
      <div className="lg:col-span-5 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-4/5" />
        <SkeletonText lines={3} />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}

/** Testimonial card skeleton */
export function TestimonialCardSkeleton() {
  return (
    <div className="card-soft p-7 space-y-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Skeleton key={n} className="w-3.5 h-3.5 rounded-sm" />
        ))}
      </div>
      <SkeletonText lines={4} />
      <div className="border-t border-gray-100 pt-4 flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

/** FAQ accordion skeleton */
export function FAQSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="border border-gray-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <Skeleton className={`h-5 ${n % 3 === 0 ? "w-4/5" : "w-3/4"}`} />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
