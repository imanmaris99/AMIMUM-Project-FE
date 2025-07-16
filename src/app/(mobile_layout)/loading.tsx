export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="loader mb-4" aria-label="Memuat..." />
      <p className="text-gray-600 text-lg font-medium">Memuat halaman, mohon tunggu sebentar...</p>
    </div>
  );
} 