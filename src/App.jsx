import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DishesDetails from "./pages/DishesDetails";
import CategoryDetails from "./pages/CategoryDetails";
import DishList from "./pages/DishList";
import CartPage from "./pages/AddToCart";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dishes/:id" element={<DishesDetails />} />
            <Route path="/category/:categoryId" element={<CategoryDetails />} />
            <Route path="/dishList" element={<DishList />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
