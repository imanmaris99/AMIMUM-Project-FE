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