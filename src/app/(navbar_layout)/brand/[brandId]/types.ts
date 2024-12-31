export interface ProductByBrandIdProps {
    id: string;
    name: string;
    price: number;
    brand_info: {
        id: number;
        name: string;
    };
    all_variants: {
        id: number;
        variant: string;
        img: string;
        discount: number;
        discounted_price: number;
        updated_at: string;
    }[];
    created_at: string;
}