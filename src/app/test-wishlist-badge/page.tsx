"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";

const TestWishlistBadge = () => {
  const { addToWishlist } = useWishlist();
  const { getNotificationCount, resetNotification } = useNotification();

  const handleAddTestProduct = () => {
    const testProduct = {
      id: `test-${Date.now()}`,
      name: `Test Product ${Date.now()}`,
      price: 25000,
      all_variants: [{
        id: 1,
        variant: "Test Variant",
        name: "Test Variant Name",
        img: "/default-image.jpg",
        discount: 10,
        discounted_price: 22500
      }],
      brand_info: {
        name: "Test Brand"
      }
    };

    console.log("Adding test product to wishlist:", testProduct);
    addToWishlist(testProduct);
  };

  const handleResetBadge = () => {
    console.log("Resetting wishlist badge");
    resetNotification("wishlist");
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Wishlist Badge</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>Current wishlist badge count:</strong> {getNotificationCount("wishlist")}</p>
        </div>
        
        <div className="space-x-4">
          <Button onClick={handleAddTestProduct}>
            Add Test Product to Wishlist
          </Button>
          
          <Button onClick={handleResetBadge} variant="outline">
            Reset Wishlist Badge
          </Button>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Add Test Product to Wishlist" to add a product</li>
            <li>Check the navbar - you should see a red badge on the wishlist icon</li>
            <li>Click "Reset Wishlist Badge" to clear the badge</li>
            <li>Check browser console for debug logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestWishlistBadge;
