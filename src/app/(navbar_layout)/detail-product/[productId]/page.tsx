import DetailProductClient from "./DetailProductClient";
import { getDetailProductServer } from "@/services/api/detail-product";
import { ErrorHandler } from "@/lib/errorHandler";
import UnifiedHeader from "@/components/common/UnifiedHeader";

export default async function DetailProduct({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  // Validate productId parameter
  if (!productId || typeof productId !== 'string') {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader 
          type="secondary"
          title="Detail Item"
          subtitle="Informasi lengkap produk"
          showBackButton={true}
        />
        <div className="px-4 py-6 text-center">
          <p className="text-red-500">ID produk tidak valid.</p>
        </div>
      </div>
    );
  }

  let detailProduct = null;
  let errorMessage: string | null = null;

  try {
    detailProduct = await getDetailProductServer(productId);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Gagal mengambil detail produk.';
    console.error('Error fetching product detail:', error);
    ErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), 'DetailProduct');
  }

  return <DetailProductClient detailProduct={detailProduct} errorMessage={errorMessage} />;
}