import { WishlistItem } from "@/types/wishlist";

export const dummyWishlistItems: WishlistItem[] = [
  {
    id: "wish-1",
    productId: "prod-1",
    name: "Buyung Upik",
    variant: "Anggur",
    quantity: "1 dus",
    price: 17500,
    image: "/buyungupik_agr-1.svg", // Buyung Upik Anggur SVG
    addedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "wish-2", 
    productId: "prod-2",
    name: "Buyung Upik",
    variant: "Cokelat",
    quantity: "1 dus",
    price: 17500,
    image: "/buyungupik_agr-1.svg", // Buyung Upik Cokelat SVG (using same image for now)
    addedAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "wish-3",
    productId: "prod-3", 
    name: "Buyung Upik",
    variant: "Cokelat",
    quantity: "1 dus",
    price: 17500,
    image: "/buyungupik_agr-1.svg", // Buyung Upik Cokelat SVG (using same image for now)
    addedAt: "2024-01-13T09:20:00Z"
  }
];

export const dummyWishlistData = {
  items: dummyWishlistItems,
  totalItems: dummyWishlistItems.length
};
