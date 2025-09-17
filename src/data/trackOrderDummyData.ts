import { TrackOrderData } from "@/types/trackOrder";

export const trackOrderDummyData: TrackOrderData = {
  items: [
    {
      id: "1",
      name: "Buyung Upik",
      variant: "Anggur",
      size: "dus",
      quantity: "1",
      price: 17500,
      image: "/buyungupik_agr-1.svg",
      status: "processing"
    }
  ],
  totalItems: 1
};
