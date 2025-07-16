export interface VariantType {
    id: number;
    product: string;
    name: string;
    img: string;
    variant: string;
    expiration: string;
    stock: number;
    discount: number;
    discounted_price: number;
}

export interface DetailProductType {
    id: string;
    name: string;
    info: string;
    variants_list: VariantType[];
    description_list: string[];
    instructions_list: string[];
    price: number;  
    is_active: boolean;
    company: string;
    avg_rating: number;
    total_rater: number;
    image_url?: string; // tambahkan agar konsisten dengan kebutuhan frontend
}

export interface DetailProductResponseType {
    status_code: number;
    message: string;
    data: DetailProductType;
}

export interface DetailProductRequestType {
    product_id: string;
}

export interface ProductType {
    id: number;
    name: string;
    image_url: string;
    price: number;
    is_active: boolean;
    // tambahkan field lain sesuai kebutuhan
}

export interface BrandDetailType {
    id: number;
    name: string;
    image_url: string;
    category: string;
    description: string;
    product_count: number;
    // tambahkan field lain sesuai kebutuhan
}

export interface BrandDetailResponseType {
    status_code: number;
    message: string;
    data: BrandDetailType;
}
