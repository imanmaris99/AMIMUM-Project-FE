export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  variant: string;
  quantity: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface WishlistData {
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistFormData {
  productId: string;
  variant: string;
}
