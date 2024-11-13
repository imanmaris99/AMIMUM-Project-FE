import { Carousel, PromoCard } from "@/app/components";
import { usePromo } from "@/hooks/usePromo";
import PromoCardSkeleton from "@/app/components/hompage/PromoCard/PromoCardSkeleton";
import { PromoProps } from "@/types/apiTypes";

const Promo = () => {
  const { promo, isLoading, isError } = usePromo();

  if (!promo || promo.length === 0) {
    return null;
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
          <p>Error: {isError.message}</p>
        ) : (
          <Carousel
            items={promo.map((promoItem: PromoProps, index: number) => (
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
