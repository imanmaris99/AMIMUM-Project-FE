import CartUI from "@/components/cart/5_pages/CartUI";
import { getCartServer } from "@/API/cart";

export default async function CartPage() {
  let cartResponse = null;
  let errorMessage: string | null = null;
  try {
    cartResponse = await getCartServer();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  // Logic interaktif tetap di Client Component (CartUI)
  return (
    <CartUI cartResponse={cartResponse} errorMessage={errorMessage} />
  );
}
