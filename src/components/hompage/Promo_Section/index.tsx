import { Carousel, PromoCard } from "@/components";
import { usePromo } from "@/hooks/usePromo";
import PromoCardSkeleton from "@/components/hompage/PromoCard/PromoCardSkeleton";
import { PromoProps } from "./types";

const Promo = () => {
  const { promo, isLoading, isError } = usePromo();

  if (!promo || promo.length === 0) {
    return null;
  }

  switch (isError) {
    case 404:
      return <div>Data tidak ditemukan. Silakan coba lagi nanti.</div>;
    case 409:
      return <div>Terjadi konflik data. Silakan coba lagi nanti.</div>;
    case 500:
      return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
    default:
      break;
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Promo spesial</h6>
      </div>

      <div className="mx-6 mt-6">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {[...Array(3)].map((_, index) => (
              <PromoCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <p>{isError}</p>
        ) : (
          <Carousel
            items={promo?.map((promoItem: PromoProps, index: number) => (
              <PromoCard key={index} promo={promoItem} />
            ))}
            itemsToShow={3}
          />
        )}
      </div>
    </>
  );
};

export default Promo;
