export interface ProductionProps {
    id: number;
    name: string;
    photo_url: string;
    description_list: string[];
    category: string;
    created_at: string;
}

export interface BrandLoaderProps {
  data: ProductionProps[];
  remaining_records: number;
  has_more: boolean;
}
