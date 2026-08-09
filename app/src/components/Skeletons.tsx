import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared skeleton loaders used across pages for a single, consistent loading
 * style. Each loader mirrors the layout of the real component it stands in for,
 * so the page doesn't shift when data arrives.
 */

/* Mirrors <ProductCard /> */
export const ProductCardSkeleton = () => (
  <div className="flex flex-col w-full">
    {/* Image */}
    <Skeleton className="aspect-[4/3] w-full rounded-xl" />

    {/* Content */}
    <div className="pt-3 flex flex-col gap-2">
      {/* Name + rating row */}
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Stock badge */}
      <Skeleton className="h-4 w-20 rounded-full" />
      {/* Price */}
      <Skeleton className="h-5 w-28" />
      {/* Store */}
      <Skeleton className="h-3 w-24" />
      {/* Button */}
      <Skeleton className="h-9 w-full rounded-md mt-1.5" />
    </div>
  </div>
);

/* A responsive grid of product card skeletons. */
export const ProductGridSkeleton = ({
  count = 8,
  className = "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6",
}: {
  count?: number;
  className?: string;
}) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/* Mirrors the two-column layout of <ProductDetailPage />. */
export const ProductDetailSkeleton = () => (
  <div className="container-main py-2">
    {/* Store bar */}
    <div className="flex items-center gap-3 py-2.5 border-b border-border-gray mb-6">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="h-4 w-40" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Left column: image + description */}
      <div className="space-y-10">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Right column: title, price, options */}
      <div className="space-y-6">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex items-baseline gap-3.5 pt-4 border-t border-border-gray">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Color swatches */}
        <div className="pt-4 border-t border-border-gray space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="pt-4 border-t border-border-gray space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* Buttons */}
        <div className="pt-6 space-y-3.5">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

/* Mirrors <StoreCard /> — ready for when the stores API is wired up. */
export const StoreCardSkeleton = () => (
  <div className="bg-white border border-border-gray rounded-xl p-3 sm:p-5 flex flex-col justify-between w-full shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
      <Skeleton className="w-10 h-10 sm:w-16 sm:h-16 rounded-full mx-auto sm:mx-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
    <Skeleton className="mt-5 h-10 w-full rounded-md" />
  </div>
);

/* A responsive grid of store card skeletons. */
export const StoreGridSkeleton = ({
  count = 6,
  className = "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6",
}: {
  count?: number;
  className?: string;
}) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <StoreCardSkeleton key={i} />
    ))}
  </div>
);

/* Mirrors a CartPage item row. */
export const CartLineSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-border-gray rounded-xl bg-white shadow-sm gap-4">
    <div className="flex gap-4 items-center">
      <Skeleton className="w-20 h-20 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="flex items-center gap-6">
      <Skeleton className="h-9 w-28 rounded-full" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="w-9 h-9 rounded-full" />
    </div>
  </div>
);
