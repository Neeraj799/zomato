import React, { useEffect, useState } from "react";

const AddToCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [isModifierDropdownOpen, setIsModifierDropdownOpen] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to access this page.");
      window.location.href = "/signIn";
      return;
    }
    fetchCartItems();
    fetchModifiers();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/cart/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart items");
      }
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert(error.message);
    }
  };

  const fetchModifiers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/modifiers`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch modifiers");
      }
      const data = await response.json();
      setModifiers(data);
    } catch (error) {
      console.error("Error fetching modifiers:", error);
      alert(error.message);
    }
  };

  const handleRemoveItem = async (dishId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/cart/deleteItem/${dishId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        await fetchCartItems();
      } else {
        throw new Error(responseData.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert(error.message);
    }
  };

  const updateCartItem = async (dishId, quantity, modifierIds) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/cart/updateItem/${dishId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            dishId,
            quantity: parseInt(quantity),
            modifierIds,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update item");
      }

      await fetchCartItems(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating item:", error);
      alert(error.message);
    }
  };

  const calculateItemTotal = (dish, modifiers = [], quantity = 1) => {
    const basePrice = parseFloat(dish?.price || 0);
    const modifierTotal = modifiers.reduce(
      (total, modifier) => total + parseFloat(modifier.price || 0),
      0
    );
    return ((basePrice + modifierTotal) * quantity).toFixed(2);
  };

  const calculateTotalAmount = () => {
    return cart.items
      .reduce((total, item) => {
        return (
          total +
          parseFloat(
            calculateItemTotal(item.dish, item.modifiers, item.quantity)
          )
        );
      }, 0)
      .toFixed(2);
  };

  const handleModifiersChange = async (dishId, modifierId, event) => {
    const item = cart.items.find((item) => item.dish._id === dishId);
    if (!item) return;

    let newModifierIds;
    if (event.target.checked) {
      // Add modifier
      newModifierIds = [...item.modifiers.map((m) => m._id), modifierId];
    } else {
      // Remove modifier
      newModifierIds = item.modifiers
        .map((m) => m._id)
        .filter((id) => id !== modifierId);
    }

    await updateCartItem(dishId, item.quantity, newModifierIds);
  };

  const handleQuantityChange = async (dishId, newQuantity) => {
    const item = cart.items.find((item) => item.dish._id === dishId);
    if (!item) return;

    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    await updateCartItem(
      dishId,
      quantity,
      item.modifiers.map((m) => m._id)
    );
  };

  const toggleModifierDropdown = (dishId) => {
    setIsModifierDropdownOpen((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-center text-gray-500 my-8">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
            >
              <div className="flex items-start space-x-4">
                {item.dish?.image?.[0] && (
                  <img
                    src={item.dish.image[0]}
                    alt={item.dish.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="font-semibold">{item.dish?.title}</h2>
                  <p className="text-sm">Price: ${item.dish?.price}</p>

                  {/* Quantity Input */}
                  <div className="mt-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.dish._id, e.target.value)
                      }
                      className="w-20 p-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Modifiers Section */}
              <div className="mt-4 md:mt-0 relative">
                <button
                  onClick={() => toggleModifierDropdown(item.dish._id)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Modifiers
                </button>

                {isModifierDropdownOpen[item.dish._id] && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    {modifiers.map((modifier) => (
                      <label
                        key={modifier._id}
                        className="flex items-center p-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={item.modifiers.some(
                            (mod) => mod._id === modifier._id
                          )}
                          onChange={(e) =>
                            handleModifiersChange(
                              item.dish._id,
                              modifier._id,
                              e
                            )
                          }
                          className="mr-2"
                        />
                        <span>
                          {modifier.name} (${modifier.price})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <p className="font-bold">
                  Total: $
                  {calculateItemTotal(item.dish, item.modifiers, item.quantity)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.dish._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex flex-col items-end">
            <p className="text-xl font-semibold mb-4">
              Total Amount: ${calculateTotalAmount()}
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
