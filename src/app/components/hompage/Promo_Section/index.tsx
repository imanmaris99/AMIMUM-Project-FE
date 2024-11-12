import { Carousel, PromoCard } from "@/app/components";

const Promo = () => {
  const promoItems = Array.from({ length: 12 }, (_, index) => <PromoCard key={index} />);

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Promo spesial</h6>
      </div>

      <div className="mx-6 mt-6">
        <Carousel items={promoItems} itemsToShow={3} />
      </div>
    </>
  );
};

export default Promo;
