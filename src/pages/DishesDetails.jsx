import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DishesDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState({});
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/dishes/${id}`);
        if (!response.ok) throw new Error("Failed to fetch dish details");
        const dishData = await response.json();
        setDish(dishData);
      } catch (error) {
        alert(error.message);
      }
    };

    const fetchModifiers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/modifiers`);
        if (!response.ok) throw new Error("Failed to fetch modifiers");
        const data = await response.json();
        setModifiers(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchDishDetails();
    fetchModifiers();
  }, [id]);

  const handleModifierChange = (modifierId) => {
    setSelectedModifiers((prevSelected) =>
      prevSelected.includes(modifierId)
        ? prevSelected.filter((id) => id !== modifierId)
        : [...prevSelected, modifierId]
    );
  };

  const handleQuantityChange = (e) => {
    // Ensure we're working with a number and it's at least 1
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setIsModalOpen(true); // Open the modal to select modifiers when Add to Cart is clicked
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const requestBody = {
        dishId: dish._id,
        modifierIds: selectedModifiers,
        quantity: parseInt(quantity),
      };

      console.log("Sending request with body:", requestBody);

      const response = await fetch("http://localhost:4000/api/cart/addItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData); // Debug log

      setSelectedModifiers([]);
      setQuantity(1);
      alert("Items added successfully");
      navigate("/cart"); // Navigate to the cart page after submitting
    } catch (error) {
      alert(error.message);
      console.error("Error adding to cart:", error); // Debug log
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">{dish.title}</h1>
      <img
        src={dish.image}
        alt={dish.name}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-lg mb-4">{dish.description}</p>
      <p className="text-xl font-semibold line-through">
        Actual Price: ${dish.actualPrice}
      </p>
      <p className="text-xl font-semibold">Price: ${dish.price}</p>
      <p className="mt-2 text-gray-600">
        Categories:{" "}
        {dish.categories?.map((category) => category.name).join(", ")}
      </p>
      <p className="mt-2 text-gray-600">
        Modifiers: {dish.modifiers?.map((mod) => mod.name).join(", ")}
      </p>
      {/* Quantity Input with Label */}
      <div className="mt-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
          min="1"
        />
      </div>

      <div>
        <button
          onClick={handleAddToCart}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add to Cart
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Select Modifiers</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {modifiers.map((modifier) => (
                <div
                  key={modifier._id}
                  className="flex items-center p-2 border rounded-lg"
                >
                  <input
                    type="checkbox"
                    id={`modifier-${modifier._id}`}
                    checked={selectedModifiers.includes(modifier._id)}
                    onChange={() => handleModifierChange(modifier._id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`modifier-${modifier._id}`}
                    className="ml-2 text-sm font-medium text-gray-800"
                  >
                    {modifier.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesDetails;
