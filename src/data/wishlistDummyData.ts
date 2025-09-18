import { WishlistItem } from "@/types/wishlist";

export const dummyWishlistItems: WishlistItem[] = [
  {
    id: "wish-1",
    productId: "prod-1",
    name: "Air Mancur Jamu Beras Kencur",
    variant: "Anggur",
    quantity: "1 dus",
    price: 17500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "wish-2", 
    productId: "prod-2",
    name: "Aji Mujarab Jamu Kunyit Asam",
    variant: "Strawberry",
    quantity: "1 dus",
    price: 18500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "wish-3",
    productId: "prod-3", 
    name: "Jamu Jago Jamu Temulawak",
    variant: "Cokelat",
    quantity: "1 dus",
    price: 19500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-13T09:20:00Z"
  },
  {
    id: "wish-4",
    productId: "prod-4", 
    name: "Nyonya Meneer Jamu Jahe Merah",
    variant: "Vanilla",
    quantity: "1 dus",
    price: 22500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-12T14:15:00Z"
  },
  {
    id: "wish-5",
    productId: "prod-5", 
    name: "Sabdo Palon Jamu Sirih Merah",
    variant: "Melon",
    quantity: "1 dus",
    price: 16500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-11T11:30:00Z"
  },
  {
    id: "wish-6",
    productId: "prod-6", 
    name: "Sido Muncul Jamu Pegagan",
    variant: "Susu",
    quantity: "1 dus",
    price: 20500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-10T16:45:00Z"
  },
  {
    id: "wish-7",
    productId: "prod-7", 
    name: "Air Mancur Jamu Temulawak",
    variant: "Mocca",
    quantity: "1 dus",
    price: 18500,
    image: "/buyungupik_agr-1.svg",
    addedAt: "2024-01-09T13:20:00Z"
  }
];

export const dummyWishlistData = {
  items: dummyWishlistItems,
  totalItems: dummyWishlistItems.length
};
