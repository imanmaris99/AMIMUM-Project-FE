const SkeletonLoader = () => (
  <div className="mt-4 mx-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
    <div className="bg-customGreen4 p-4 rounded-lg mt-4 min-h-24 flex items-center">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
    <div className="mt-4">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);
export default SkeletonLoader;
