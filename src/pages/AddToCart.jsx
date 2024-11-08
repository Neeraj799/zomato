import React, { useEffect, useState } from "react";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [modifiers, setModifiers] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/cart/");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch cart items");
        setCartItems(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchModifiers = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/modifiers");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch modifiers");
        setModifiers(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchModifiers();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item._id !== itemId));
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      alert("Error removing item");
    }
  };

  const calculateItemTotal = (dish, modifiers) => {
    let total = dish?.price || 0;
    modifiers.forEach((modifier) => {
      total += parseFloat(modifier.price) || 0;
    });
    return total;
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item.dish, item.modifiers);
    }, 0);
  };

  const handleRemoveModifier = (itemId, modifierId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              modifiers: item.modifiers.filter(
                (modifier) => modifier._id !== modifierId
              ),
            }
          : item
      )
    );
  };

  const handleAddModifier = (itemId, modifier) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              modifiers: [...item.modifiers, modifier],
            }
          : item
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">Your Cart</h1>

      <div>
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center mb-4 p-4 border-b"
          >
            <div className="flex items-center">
              <img
                src={item.dish?.image[0]}
                alt={item.dish?.title}
                className="w-16 h-16 object-cover mr-4"
              />
              <div>
                <h2 className="font-semibold">{item.dish?.title}</h2>
                <p className="text-sm">Price: ${item.dish?.price}</p>

                {item.modifiers.length > 0 && (
                  <div className="text-sm mt-2">
                    <strong>Modifiers:</strong>
                    <ul>
                      {item.modifiers.map((modifier) => (
                        <li key={modifier._id} className="flex justify-between">
                          {modifier.name} - ${modifier.price}
                          <button
                            onClick={() =>
                              handleRemoveModifier(item._id, modifier._id)
                            }
                            className="text-red-500 ml-2"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-2">
                  <label
                    htmlFor="modifier-select"
                    className="text-sm font-medium"
                  >
                    Add Modifier:
                  </label>
                  <select
                    id="modifier-select"
                    className="border rounded px-2 py-1 ml-2"
                    onChange={(e) => {
                      const selectedModifier = modifiers.find(
                        (mod) => mod._id === e.target.value
                      );
                      if (selectedModifier) {
                        handleAddModifier(item._id, selectedModifier);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a modifier
                    </option>
                    {modifiers.map((modifier) => (
                      <option key={modifier._id} value={modifier._id}>
                        {modifier.name} - ${modifier.price}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="font-bold mt-2">
                  Item Total: ${calculateItemTotal(item.dish, item.modifiers)}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveItem(item._id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xl font-semibold">
          Total Amount: ${calculateTotalAmount()}
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded mt-4">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
