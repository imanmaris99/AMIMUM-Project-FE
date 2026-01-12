import Spinner from "@/components/ui/Spinner";

const TagSkeleton = () => {
  return (
    <div className="mx-6 mt-6 flex flex-col items-center justify-center min-h-[80px]">
      <Spinner className="mb-2" size={28} label="Memuat kategori..." />
      <p className="text-gray-600 text-sm">Memuat kategori...</p>
    </div>
  );
};

export default TagSkeleton;
