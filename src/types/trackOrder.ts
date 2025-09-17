export interface TrackOrderItem {
  id: string;
  name: string;
  variant: string;
  size: string;
  quantity: string;
  price: number;
  image: string;
  status?: string;
}

export interface TrackOrderData {
  items: TrackOrderItem[];
  totalItems: number;
}
