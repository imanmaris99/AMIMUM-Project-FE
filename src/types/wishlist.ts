export interface WishlistItem {
  id: string;
  productId?: string;
  wishlistId?: number;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
  addedAt: string;
  brand?: string;
  originalPrice?: number;
  discount?: number;
}

export interface WishlistData {
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistFormData {
  productId: string;
  variant: string;
}
