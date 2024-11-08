// DishesDetails.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DishesDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState({});
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
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
  console.log(selectedModifiers);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/cart/addItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishId: dish._id,
          modifierIds: selectedModifiers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add cart");
      }

      setSelectedModifiers([]);
      alert("Items added successfully");
      navigate("/cart");
    } catch (error) {
      alert(error.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
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

      <button
        onClick={openModal}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Choose Modifiers
      </button>

      {selectedModifiers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Modifiers:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {modifiers
              .filter((modifier) => selectedModifiers.includes(modifier._id))
              .map((modifier) => (
                <li key={modifier._id}>{modifier.name}</li>
              ))}
          </ul>
        </div>
      )}

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
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={handleAddToCart}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default DishesDetails;
