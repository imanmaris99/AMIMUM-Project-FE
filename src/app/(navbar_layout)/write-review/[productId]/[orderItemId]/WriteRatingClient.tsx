"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import RatingForm from "@/components/rating/RatingForm";
import { getOrderDetail } from "@/services/api/orders";
import {
  createProductRating,
  getEligibleRatingOrderItems,
  EligibleRatingOrderItem,
} from "@/services/api/rating";
import { resolvePrivateRatingAccess } from "@/lib/privateRatingAccess";
import { RATING_PRIVATE_FORM_ACCESS_COPY } from "@/lib/ratingConstraints";

interface WriteRatingClientProps {
  productId: string;
  orderItemId: string;
  productName: string;
}

type AccessState = "loading" | "available" | "already-rated" | "unavailable" | "error";

const WriteRatingClient = ({ productId, orderItemId, productName }: WriteRatingClientProps) => {
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [eligibleOrderItem, setEligibleOrderItem] = useState<EligibleRatingOrderItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    const normalizedOrderItemId = Number(orderItemId);

    setAccessState("loading");
    setEligibleOrderItem(null);

    if (
      !productId.trim() ||
      !Number.isSafeInteger(normalizedOrderItemId) ||
      normalizedOrderItemId <= 0
    ) {
      setAccessState("unavailable");
      return () => {
        isCurrent = false;
      };
    }

    const verifyPurchase = async () => {
      try {
        const eligibleResponse = await getEligibleRatingOrderItems(productId);
        if (!isCurrent) return;

        const requestedItem = eligibleResponse.data.find(
          (item) => item.order_item_id === normalizedOrderItemId,
        );
        if (!requestedItem) {
          setAccessState("unavailable");
          return;
        }

        const orderResponse = await getOrderDetail(requestedItem.order_id);
        if (!isCurrent) return;

        const access = resolvePrivateRatingAccess(
          productId,
          normalizedOrderItemId,
          eligibleResponse.data,
          orderResponse.data,
        );
        setAccessState(access.kind);
        setEligibleOrderItem(access.kind === "available" ? access.orderItem : null);
      } catch {
        if (isCurrent) setAccessState("error");
      }
    };

    void verifyPurchase();
    return () => {
      isCurrent = false;
    };
  }, [productId, orderItemId, retryVersion]);

  const handleSubmit = async (rate: number, review: string, orderItem: EligibleRatingOrderItem) => {
    if (accessState !== "available" || !eligibleOrderItem) return;

    setIsSubmitting(true);
    try {
      await createProductRating({
        productId,
        orderItemId: orderItem.order_item_id,
        rate,
        review,
        variantId: orderItem.variant_id,
      });
      toast.success("Rating berhasil dikirim. Membuka kumpulan ulasan produk…");
      router.replace(`/detail-product/${encodeURIComponent(productId)}#product-ratings`);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Rating belum bisa dikirim. Silakan coba lagi.";
      if (message.includes("sudah diberi rating")) {
        setAccessState("already-rated");
        setEligibleOrderItem(null);
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productReviewsHref = `/detail-product/${encodeURIComponent(productId)}#product-ratings`;

  return (
    <LoginProtection useModal feature="rating">
      <div className="min-h-screen bg-transparent pb-8">
        <UnifiedHeader
          type="secondary"
          title="Rating & Ulasan"
          subtitle="Khusus pembeli"
          showBackButton={true}
        />

        <main className="mx-auto w-full max-w-xl px-4 py-5">
          <section className="rounded-3xl bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Star className="h-5 w-5 fill-amber-400" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Beri rating untuk pembelian Anda</h1>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {RATING_PRIVATE_FORM_ACCESS_COPY}
                </p>
              </div>
            </div>

            {accessState === "loading" && (
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Memverifikasi item pembelian Anda…
              </div>
            )}

            {accessState === "available" && eligibleOrderItem && (
              <div className="mt-5">
                <RatingForm
                  productName={productName}
                  orderItems={[eligibleOrderItem]}
                  selectedOrderItemId={String(eligibleOrderItem.order_item_id)}
                  onOrderItemChange={() => undefined}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  className="border-emerald-100 p-4 shadow-none sm:p-5"
                />
              </div>
            )}

            {accessState === "already-rated" && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="status">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>Item pesanan ini sudah diberi rating. Form tidak dapat digunakan lagi untuk item tersebut.</p>
                </div>
                <Link href="/my-ratings" className="mt-3 inline-flex font-semibold text-emerald-800 underline underline-offset-2">
                  Lihat Rating & Ulasan Saya
                </Link>
              </div>
            )}

            {accessState === "unavailable" && (
              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="alert">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
                  <p>Item ini tidak memenuhi syarat rating atau bukan pembelian yang dapat diakses dari akun Anda.</p>
                </div>
              </div>
            )}

            {accessState === "error" && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="alert">
                <p>Informasi pembelian belum bisa diverifikasi. Coba muat ulang sebelum mengirim rating.</p>
                <button
                  type="button"
                  onClick={() => setRetryVersion((version) => version + 1)}
                  className="mt-3 rounded-xl border border-amber-300 px-3 py-2 font-semibold hover:bg-amber-100"
                >
                  Coba lagi
                </button>
              </div>
            )}

            <div className="mt-5 border-t border-gray-100 pt-4">
              <Link href={productReviewsHref} className="text-sm font-semibold text-emerald-800 underline underline-offset-2">
                Lihat kumpulan ulasan produk
              </Link>
            </div>
          </section>
        </main>
      </div>
    </LoginProtection>
  );
};

export default WriteRatingClient;
