export interface CardProductProps {
    id: string;
    name: string;
    price: number;
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
