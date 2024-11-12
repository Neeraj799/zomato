import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DishesList = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = selectedCategory
          ? `http://localhost:4000/api/dishes/category/${selectedCategory}`
          : "http://localhost:4000/api/dishes/";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch dishes");
        }
        const data = await response.json();
        setDishes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [selectedCategory]);

  // Sort dishes based on price
  const sortedDishes = [...dishes].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const handleDishClick = (dishId) => {
    navigate(`/dishes/${dishId}`);
  };

  if (loading)
    return <p className="text-center text-xl text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Dishes List
      </h2>

      {/* Category Selection Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="category-select"
          className="block text-lg font-medium text-gray-700"
        >
          Filter by Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-2 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort by Price Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="sort-select"
          className="block text-lg font-medium text-gray-700"
        >
          Sort by Price:
        </label>
        <select
          id="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="mt-2 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Display Dishes */}
      <ul className="flex flex-wrap gap-6 justify-center">
        {sortedDishes.map((dish) => (
          <li
            key={dish._id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleDishClick(dish._id)}
          >
            <h3 className="text-2xl font-semibold text-gray-800">
              {dish.title}
            </h3>

            {dish?.image?.[0] && (
              <img
                src={dish.image[0]}
                alt={dish.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <p className="text-lg mb-4">{dish.description}</p>
            <p className="text-xl font-semibold line-through">
              Actual Price: ${dish.actualPrice}
            </p>
            <p className="text-xl font-semibold">Price: ${dish.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishesList;
