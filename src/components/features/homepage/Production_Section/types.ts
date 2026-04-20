// Import from centralized types to ensure consistency with API
import type { ProductionProps } from "@/types/apiTypes";
export type { ProductionProps };

export interface BrandLoaderProps {
  data: ProductionProps[];
  remaining_records: number;
  has_more: boolean;
}
