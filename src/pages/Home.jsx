import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);

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

  return (
    <>
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Our Top Dishes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.slice(0, 5).map((dish) => (
            <Link to={`/dishes/${dish._id}`} key={dish._id}>
              <div
                key={dish.id}
                className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {dish.title}
                </h3>
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-24 h-24 object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Our Top Categories
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 5).map((category) => (
            <Link to={`/category/${category._id}`} key={category._id}>
              <div
                key={category._id}
                className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-24 h-24 object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
