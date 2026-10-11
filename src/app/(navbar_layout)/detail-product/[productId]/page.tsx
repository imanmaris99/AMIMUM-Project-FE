import type { Metadata } from "next";
import DetailProductClient from "./DetailProductClient";
import { getDetailProductServer } from "@/services/api/detail-product";
import { ErrorHandler } from "@/lib/errorHandler";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import {
  buildOpenGraphMetadata,
  getProductImage,
  JsonLd,
  productDescription,
  productJsonLd,
  SITE_NAME,
  truncateText,
} from "@/lib/seo";

type DetailProductPageProps = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: DetailProductPageProps): Promise<Metadata> {
  const { productId } = await params;

  if (!productId || typeof productId !== "string") {
    return buildOpenGraphMetadata({
      title: "Detail Produk",
      description: `Detail produk katalog resmi ${SITE_NAME}.`,
      path: "/search",
    });
  }

  try {
    const product = await getDetailProductServer(productId);
    const title = truncateText(`${product.name} - ${product.company || SITE_NAME}`, 58);
    const description = productDescription(product);

    return buildOpenGraphMetadata({
      title,
      description,
      path: `/detail-product/${product.id}`,
      image: getProductImage(product),
      type: "website",
    });
  } catch {
    return buildOpenGraphMetadata({
      title: "Produk belum tersedia",
      description: "Detail produk belum bisa dimuat atau belum tersedia di katalog Toko Herbal Amimum.",
      path: `/detail-product/${productId}`,
    });
  }
}

export default async function DetailProduct({ params }: DetailProductPageProps) {
  const { productId } = await params;

  if (!productId || typeof productId !== 'string') {
    return (
      <div className="min-h-screen bg-transparent">
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
    errorMessage = 'Detail produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.';
    ErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), 'DetailProduct');
  }

  return (
    <>
      {detailProduct ? <JsonLd data={productJsonLd(detailProduct)} /> : null}
      <DetailProductClient detailProduct={detailProduct} errorMessage={errorMessage} />
    </>
  );
}