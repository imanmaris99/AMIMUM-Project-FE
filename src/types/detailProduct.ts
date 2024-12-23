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
}

export interface DetailProductResponseType {
    status_code: number;
    message: string;
    data: DetailProductType;
}

export interface DetailProductRequestType {
    product_id: string;
}
