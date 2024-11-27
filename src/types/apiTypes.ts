export interface CategoryProps {
  id: number;
  name: string;
  description_list: string[];
  created_at: string;
}

export interface UserProfileProps {
  id: string;
  firebase_uid: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  photo_url: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromoProps {
  id: number;
  name: string;
  photo_url: string;
  promo_special: number;
}

export interface ProductionProps {
  id: number;
  name: string;
  photo_url: string;
  description_list: string[];
  category: string;
  created_at: string;
}

export interface ArticleProps {
  display_id: number;
  title: string;
  img: string;
  description_list: string[];
}

export interface CartItemType {
  id: number;
  product_name: string;
  product_price: number;
  variant_info: {
    id: number;
    variant: string;
    name: string;
    img: string;
    discount: number;
  };
  quantity: number;
  is_active: boolean;
  created_at: string;
}

export interface CartTotalPricesType {
  all_item_active_prices: number;
  all_promo_active_prices: number;
  total_all_active_prices: number;
}

export interface CartResponseType {
  status_code: number;
  message: string;
  data: CartItemType[];
  total_prices: CartTotalPricesType;
}
