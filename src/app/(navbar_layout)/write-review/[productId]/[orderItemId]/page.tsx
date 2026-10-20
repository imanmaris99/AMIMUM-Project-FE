import type { Metadata } from "next";
import { getDetailProductServer } from "@/services/api/detail-product";
import WriteRatingClient from "./WriteRatingClient";

type WriteRatingPageProps = {
  params: Promise<{ productId: string; orderItemId: string }>;
};

export const metadata: Metadata = {
  title: "Rating Khusus Pembeli | Toko Herbal Amimum",
  robots: { index: false, follow: false },
};

export default async function WriteRatingPage({ params }: WriteRatingPageProps) {
  const { productId, orderItemId } = await params;
  let productName = "Produk yang dibeli";

  try {
    const product = await getDetailProductServer(productId);
    productName = product.name;
  } catch {
    // The authenticated eligibility check below will fail closed if the product is unavailable.
  }

  return (
    <WriteRatingClient
      productId={productId}
      orderItemId={orderItemId}
      productName={productName}
    />
  );
}
