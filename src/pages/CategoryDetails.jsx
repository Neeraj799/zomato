import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryDishes = () => {
  const { categoryId } = useParams();
  const [dishes, setDishes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch dishes based on categoryId on initial page load
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/dishes`);
        if (!response.ok) throw new Error("Failed to fetch dishes");

        const data = await response.json();
        const filteredDishes = data.filter(
          (dish) => dish.category && dish.category._id === categoryId
        );
        setDishes(filteredDishes);
      } catch (error) {
        window.alert(error.message);
      }
    };

    if (categoryId) {
      fetchDishes(); // Fetch dishes initially
    }
  }, [categoryId]); // Only trigger when categoryId changes

  // Fetch sorted dishes based on sortOrder change
  useEffect(() => {
    const sortDishes = async () => {
      try {
        if (!categoryId) return; // Ensure categoryId exists before fetching sorted dishes

        const response = await fetch(
          `http://localhost:4000/api/categories/dishes/${categoryId}?sortOrder=${sortOrder}`
        );
        if (!response.ok) throw new Error("Failed to fetch sorted dishes");

        const data = await response.json();
        setDishes(data); // Update dishes with the sorted data
      } catch (error) {
        window.alert(error.message);
      }
    };

    // Trigger sorting only when sortOrder changes
    if (categoryId && sortOrder) {
      sortDishes();
    }
  }, [sortOrder, categoryId]); // Trigger when sortOrder or categoryId changes

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Dishes in this Category
      </h1>

      <div className="flex justify-center mb-6">
        <label htmlFor="sortOrder" className="mr-2 font-semibold">
          Sort by Price:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <div
              key={dish._id}
              className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {dish.title}
              </h3>
              <img
                src={dish.image[0]}
                alt={dish.title}
                className="w-full h-48 object-cover"
              />
              <p className="text-gray-700 mt-2">{dish.description}</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                ${dish.price}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No dishes available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDishes;
