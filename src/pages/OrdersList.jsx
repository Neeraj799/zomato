import React, { useEffect, useState } from "react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/orders/");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="orders-list max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Order List
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Order ID: <span className="text-blue-600">{order._id}</span>
              </h3>
              <p className="text-gray-600">
                User: <span className="font-medium">{order.fullName}</span>
              </p>
              <p className="text-gray-600">
                Created At:{" "}
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </p>

              <h4 className="text-lg font-semibold text-gray-700 mt-4">
                Items:
              </h4>
              <ul className="mt-2 space-y-4">
                {order.items.map((item, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="text-gray-700">
                      Dish:{" "}
                      <span className="font-medium">{item.dish.title}</span>
                    </p>
                    <p className="text-gray-700">
                      Quantity:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </p>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-700 font-semibold">
                          Modifiers:
                        </p>
                        <ul className="list-disc list-inside ml-4 text-gray-600">
                          {item.modifiers.map((modifier) => (
                            <li key={modifier._id}>{modifier.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
