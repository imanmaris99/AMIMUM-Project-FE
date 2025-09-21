"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { useTransaction } from "@/contexts/TransactionContext";
import { useCart } from "@/contexts/CartContext";

const NotificationTest = () => {
  const { addNotification, resetNotification, getNotificationCount } = useNotification();
  const { addTransaction } = useTransaction();
  const { cartItems } = useCart();

  const handleAddTestTransaction = () => {
    // Create dummy order data
    const orderData = {
      delivery_type: 'delivery',
      notes: 'Test order',
      shipment_id: 'test-shipment',
      shipment_address: {
        address: 'Test Address',
        courier: 'Test Courier'
      },
      courier_service: 'Test Courier Service'
    };

    // Create dummy cart items if cart is empty
    const testCartItems = cartItems.length > 0 ? cartItems : [
      {
        id: 1,
        product_id: 'test-product',
        product_name: 'Test Product',
        product_price: 10000,
        variant_id: 1,
        variant_info: {
          id: 1,
          variant: 'Test Variant',
          name: 'Test Variant Name',
          img: '/default-image.jpg',
          discount: 0,
          discounted_price: 10000
        },
        quantity: 1,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];

    addTransaction(orderData, testCartItems);
  };

  const handleAddTrackingNotification = () => {
    addNotification("tracking");
  };

  const handleAddTransactionNotification = () => {
    addNotification("transaction");
  };

  const handleResetTracking = () => {
    resetNotification("tracking");
  };

  const handleResetTransaction = () => {
    resetNotification("transaction");
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Notification Badge Test</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Tracking Order</h2>
          <p className="text-sm text-gray-600 mb-2">
            Current count: {getNotificationCount("tracking")}
          </p>
          <div className="space-y-2">
            <button
              onClick={handleAddTrackingNotification}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm"
            >
              Add Tracking Notification
            </button>
            <button
              onClick={handleResetTracking}
              className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
            >
              Reset Tracking
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Transaction</h2>
          <p className="text-sm text-gray-600 mb-2">
            Current count: {getNotificationCount("transaction")}
          </p>
          <div className="space-y-2">
            <button
              onClick={handleAddTransactionNotification}
              className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm"
            >
              Add Transaction Notification
            </button>
            <button
              onClick={handleResetTransaction}
              className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
            >
              Reset Transaction
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Test Full Transaction Flow</h2>
        <p className="text-sm text-gray-600 mb-2">
          This will add a new transaction and trigger both badge counters
        </p>
        <button
          onClick={handleAddTestTransaction}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Test Transaction
        </button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800">Instructions:</h3>
        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>• Click &quot;Add Test Transaction&quot; to simulate a new transaction</li>
          <li>• Both Tracking Order and Transaction badges should show +1</li>
          <li>• Click on the navbar menu items to reset their respective badges</li>
          <li>• Add more notifications to see the counter increment</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTest;
