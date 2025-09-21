"use client";

import { useCart } from "@/contexts/CartContext";
import { useTransaction } from "@/contexts/TransactionContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TestCartCheckout = () => {
  const { cartItems, addToCart, removeActiveItems, updateActiveStatus } = useCart();
  const { addTransaction } = useTransaction();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestProduct = (name: string, id: string) => {
    const testProduct = {
      id: id,
      name: name,
      price: 25000
    };

    const testVariant = {
      id: 1,
      variant: "Test Variant",
      name: "Test Variant Name",
      img: "/default-image.jpg",
      discount: 10,
      discounted_price: 22500
    };

    addToCart(testProduct, testVariant);
  };

  const testCheckoutScenario = () => {
    setTestResults([]);
    
    // Step 1: Add 2 items
    addTestProduct("Item 1", "item-1");
    addTestProduct("Item 2", "item-2");
    
    setTestResults(prev => [...prev, "✅ Added 2 items to cart"]);
    
    setTimeout(() => {
      // Step 2: Select only first item
      const firstItem = cartItems.find(item => item.product_id === "item-1");
      if (firstItem) {
        updateActiveStatus(firstItem.id, true);
        setTestResults(prev => [...prev, "✅ Selected only first item for checkout"]);
      }
      
      setTimeout(() => {
        // Step 3: Simulate checkout
        const activeItems = cartItems.filter(item => item.is_active);
        if (activeItems.length > 0) {
          const orderData = {
            delivery_type: 'delivery',
            notes: 'Test order',
            shipment_id: 'test-shipment',
            items: activeItems.map(item => ({
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity
            }))
          };
          
          addTransaction(orderData, activeItems);
          removeActiveItems();
          
          setTestResults(prev => [...prev, "✅ Checked out selected items"]);
          
          setTimeout(() => {
            // Step 4: Check remaining items
            const remainingItems = cartItems.filter(item => !item.is_active);
            if (remainingItems.length > 0) {
              setTestResults(prev => [...prev, `✅ SUCCESS: ${remainingItems.length} items remain in cart: ${remainingItems.map(item => item.product_name).join(", ")}`]);
            } else {
              setTestResults(prev => [...prev, "❌ FAILED: No items remain in cart"]);
            }
          }, 1000);
        }
      }, 1000);
    }, 1000);
  };

  const clearCart = () => {
    // Clear all items for fresh test
    cartItems.forEach(item => {
      updateActiveStatus(item.id, true);
    });
    removeActiveItems();
    setTestResults([]);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Cart Checkout Bug Fix</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Current Cart State:</h3>
            <p><strong>Total items:</strong> {cartItems.length}</p>
            <p><strong>Active items:</strong> {cartItems.filter(item => item.is_active).length}</p>
            <p><strong>Inactive items:</strong> {cartItems.filter(item => !item.is_active).length}</p>
          </div>
          
          <div className="space-y-2">
            <Button onClick={testCheckoutScenario} className="w-full">
              Test Checkout Scenario
            </Button>
            
            <Button onClick={clearCart} variant="outline" className="w-full">
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Test Results:</h3>
          <div className="p-4 bg-black text-green-400 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Click "Test Checkout Scenario" to start...</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Test Scenario:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Add 2 items to cart</li>
          <li>Select only 1 item for checkout</li>
          <li>Checkout the selected item</li>
          <li>Verify that the unselected item remains in cart</li>
        </ol>
      </div>
    </div>
  );
};

export default TestCartCheckout;
