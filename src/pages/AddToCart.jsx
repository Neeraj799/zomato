import React, { useEffect, useState } from "react";

const AddToCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [isModifierDropdownOpen, setIsModifierDropdownOpen] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRemoveItem = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/cart/deleteItem/${item._id}`,
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

  const updateCartItem = async (itemId, quantity, modifierIds) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/cart/updateItem/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            itemId,
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

  const handleModifiersChange = async (itemId, modifierId, event) => {
    const cartItem = cart.items.find((item) => item._id === itemId);
    if (!cartItem) return;

    let newModifierIds;
    if (event.target.checked) {
      // Add modifier
      newModifierIds = [...cartItem.modifiers.map((m) => m._id), modifierId];
    } else {
      // Remove modifier
      newModifierIds = cartItem.modifiers
        .map((m) => m._id)
        .filter((id) => id !== modifierId);
    }

    await updateCartItem(itemId, cartItem.quantity, newModifierIds);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = cart.items.find((item) => item._id === itemId);
    if (!item) return;

    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    await updateCartItem(
      itemId,
      quantity,
      item.modifiers.map((m) => m._id)
    );
  };

  const toggleModifierDropdown = (itemId) => {
    setIsModifierDropdownOpen((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Add new function for checkout
  const handleCheckoutSubmit = async () => {
    if (
      !fullName.trim() ||
      !mobile.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart.items.map((item) => ({
          dish: item.dish._id,
          quantity: item.quantity,
          modifiers: item.modifiers.map((mod) => mod._id),
        })),
        totalAmount: parseFloat(calculateTotalAmount()),

        fullName: fullName.trim(),
        address: address.trim(),
        mobile: mobile.trim(),
        street: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      };

      const response = await fetch("http://localhost:4000/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Clear cart and close modal on success
      setCart({ items: [] });
      setIsModalOpen(false);
      setFullName("");
      setMobile("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
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

                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected Modifiers:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.modifiers.map((modifier) => (
                        <span
                          key={modifier._id}
                          className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                        >
                          {modifier.name}
                        </span>
                      ))}
                      {item.modifiers.length === 0 && (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-medium">Quantity</p>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      className="w-20 p-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Modifiers Section */}
              <div className="mt-4 md:mt-0 relative">
                <button
                  onClick={() => toggleModifierDropdown(item._id)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Modifiers
                </button>

                {isModifierDropdownOpen[item._id] && (
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
                            handleModifiersChange(item._id, modifier._id, e)
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
                  onClick={() => handleRemoveItem(item)}
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">
                Order Total: ${calculateTotalAmount()}
              </p>
            </div>

            {/* Full Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Mobile Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Mobile</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* Delivery Address Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full p-2 border rounded-md h-24 resize-none"
                required
              />
            </div>

            {/* City Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* State Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter your state"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Pincode</label>
              <input
                type="Number"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter your state"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckoutSubmit}
                disabled={
                  isLoading ||
                  !fullName.trim() ||
                  !mobile.trim() ||
                  !address.trim() ||
                  !city.trim() ||
                  !state.trim() ||
                  !pincode.trim()
                }
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
            ${
              isLoading ||
              !fullName.trim() ||
              !mobile.trim() ||
              !address.trim() ||
              !city.trim() ||
              !state.trim() ||
              !pincode.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
