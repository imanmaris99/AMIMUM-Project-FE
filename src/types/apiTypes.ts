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
  display_id: string;
  title: string;
  img: string;
  description_list: string[];
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