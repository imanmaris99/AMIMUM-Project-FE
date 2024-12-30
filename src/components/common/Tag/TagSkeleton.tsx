const TagSkeleton = () => {
  return (
    <div className="mx-6 mt-6">
      <h6 className="font-semibold font-jakarta">Kategori</h6>
      <div className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-full px-4 py-2 w-fit bg-gray-300 animate-pulse"
          >
            <p className="font-jakarta text-xs text-transparent">Loading</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSkeleton;
