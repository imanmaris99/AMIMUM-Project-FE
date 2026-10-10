const SkeletonLoader = () => (
  <div className="mx-4 mt-4 space-y-3 animate-pulse sm:mx-6">
    <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
      <div className="mb-3 h-3 w-24 rounded-full bg-emerald-100" />
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-3xl bg-emerald-50 ring-1 ring-emerald-100" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-36 rounded-full bg-gray-200" />
          <div className="h-4 w-28 rounded-full bg-gray-100" />
          <div className="h-7 w-24 rounded-full bg-emerald-50" />
        </div>
      </div>
    </div>
    <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
      <div className="mb-3 h-3 w-24 rounded-full bg-emerald-100" />
      <div className="space-y-2">
        <div className="h-4 rounded-full bg-gray-100" />
        <div className="h-4 rounded-full bg-gray-100" />
        <div className="h-4 w-5/6 rounded-full bg-gray-100" />
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
