import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryDishes = () => {
  const { categoryId } = useParams();
  const [dishes, setDishes] = useState([]);

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
      fetchDishes();
    }
  }, [categoryId]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Dishes in this Category
      </h1>
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
