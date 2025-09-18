import CartUI from "@/components/cart/5_pages/CartUI";
import { generateCartData } from "@/data/dataUtils";
import { CartProvider } from "@/contexts/CartContext";

export default async function CartPage() {
  let cartResponse = null;
  let errorMessage: string | null = null;
  
  // API call dinonaktifkan sementara karena server sedang down
  // try {
  //   cartResponse = await getCartServer();
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }
  
  // Menggunakan centralized data management
  try {
    cartResponse = generateCartData();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  
  // Logic interaktif tetap di Client Component (CartUI)
  return (
    <CartProvider>
      <CartUI cartResponse={cartResponse} errorMessage={errorMessage} />
    </CartProvider>
  );
}
