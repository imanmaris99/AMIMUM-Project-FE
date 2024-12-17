export interface CartItemType {
    id: number;
    product_name: string;
    product_price: number;
    variant_info: {
      id: number;
      variant: string;
      name: string;
      img: string;
      discount: number;
    };
    quantity: number;
    is_active: boolean;
    created_at: string;
  }
  
  export interface CartTotalPricesType {
    all_item_active_prices: number;
    all_promo_active_prices: number;
    total_all_active_prices: number;
  }
  
  export interface CartResponseType {
    status_code: number;
    message: string;
    data: CartItemType[];
    total_prices: CartTotalPricesType;
  }
  
  export interface TotalCartItemsType {
    total_items: number;
  }
  
  export interface TotalCartItemsResponseType {
    status_code: number;
    message: string;
    data: TotalCartItemsType;
  }
  
  export interface CartItemQtyPayload {
    cart: {
      cart_id: number;
    };
    quantity_update: {
      quantity: number;
    };
  }
  
  export interface CartItemActPayload {
    cart: {
      cart_id: number;
    };
    activate_update: {
      is_active: boolean;
    };
  }
  