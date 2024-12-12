import { Carousel, PromoCard } from "@/app/components";
import { usePromo } from "@/app/hooks/usePromo";
import PromoCardSkeleton from "@/app/components/hompage/PromoCard/PromoCardSkeleton";
import { PromoProps } from "./types";

const Promo = () => {
  const { promo, isLoading, isError, errorMessage } = usePromo();

  if (!promo || promo.length === 0) {
    return null;
  }

  if (isError) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Promo spesial</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold">
          {errorMessage}
        </div>
      </>
    );
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
