import React, { useEffect, useState } from "react";

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/dishes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch dishes");

        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        alert(error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert(error.message);
      }
    };

    fetchDishes();
    fetchCategories();
  }, []);

  useEffect(() => {
    let updatedDishes = [...dishes];

    // Filter by selected category
    if (selectedCategory !== "all") {
      updatedDishes = updatedDishes.filter(
        (dish) => dish.categories && dish.categories.name === selectedCategory
      );
    }

    // Sort by price based on selected sort order
    if (sortOrder === "asc") {
      updatedDishes.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      updatedDishes.sort((a, b) => b.price - a.price);
    }

    setFilteredDishes(updatedDishes); // Update filteredDishes state
  }, [dishes, selectedCategory, sortOrder]); // Re-run when dishes, selectedCategory, or sortOrder changes

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Dishes</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="font-semibold mr-2">Sort by Price:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2"
        >
          <option value="none">None</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish._id}
            className="border border-gray-300 rounded-lg p-4 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {dish.title}
            </h3>
            <img
              src={dish.image}
              alt={dish.title}
              className="w-full h-48 object-cover mb-4"
            />
            <p className="text-gray-700 mb-2">{dish.description}</p>
            <p className="text-lg font-semibold">Price: ${dish.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishList;
