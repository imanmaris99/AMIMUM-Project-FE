export interface CategoryProps {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CategoriesResponseType {
  status_code: number;
  message: string;
  data: CategoryProps[];
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
  photo_url: string | null;
  promo_special: number;
}

export interface PromosResponseType {
  status_code: number;
  message: string;
  data: PromoProps[];
}

export interface ProductionProps {
  id: number;
  name: string;
  photo_url: string | null;
  description_list: string[];
  category: string;
  created_at: string;
}

export interface BrandsResponseType {
  status_code: number;
  message: string;
  data: ProductionProps[];
}

// Tipe data yang sesuai dengan backend DetailProductionDto
export interface DetailProductionType {
  id: number;
  name: string;
  photo_url: string;
  description_list: string[];
  category: string;
  total_product: number;
  total_product_with_promo: number;
  created_at: string;
}

export interface ProductionDetailResponseType {
  status_code: number;
  message: string;
  data: DetailProductionType;
}

export interface ArticleProps {
  display_id: number;
  title: string;
  img: string;
  description_list: string[];
}

export interface ArticlesResponseType {
  status_code: number;
  message: string;
  data: ArticleProps[];
}






export interface BrandFilteredLoader {
  data: ProductionProps[];
  remaining_records: number;
  has_more: boolean;
}

// Tipe data yang sesuai dengan backend DTO
export interface BrandInfoType {
  id: number;
  name: string;
  photo_url: string;
}

export interface VariantAllProductType {
  id: number;
  variant: string;
  img: string;
  discount: number;
  discounted_price: number;
  updated_at: string;
}

export interface AllProductInfoType {
  id: string;
  name: string;
  price: number;
  image: string;
  brand_info: BrandInfoType;
  all_variants: VariantAllProductType[];
  created_at: string;
  brand_highest_discount?: number; // Optional field for promo products
}

export interface AllProductInfoResponseType {
  status_code: number;
  message: string;
  data: AllProductInfoType[];
}

export interface ProductListScrollResponseType {
  data: AllProductInfoType[];
  has_more: boolean;
}

// Cart related types
export interface CartItemType {
  id: string;
  product_id: string;
  variant_id: number;
  quantity: number;
  price: number;
  product_name: string;
  variant_name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface CartTotalPricesType {
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export interface CartResponseType {
  status_code: number;
  message: string;
  data: {
    items: CartItemType[];
    total_prices: CartTotalPricesType;
  };
}

export interface TotalCartItemsResponseType {
  status_code: number;
  message: string;
  data: {
    total_items: number;
  };
}

export interface CartItemActPayload {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface CartItemQtyPayload {
  cart_item_id: string;
  quantity: number;
}

// Brand Detail Response Type
export interface BrandDetailResponseType {
  status_code: number;
  message: string;
  data: {
    id: number;
    name: string;
    photo_url: string;
    description_list: string[];
    total_products: number;
    created_at: string;
  };
}