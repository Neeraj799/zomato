import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DishesDetails from "./pages/DishesDetails";
import CategoryDetails from "./pages/CategoryDetails";
import DishList from "./pages/DishList";
import CartPage from "./pages/AddToCart";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/signIn";
import Dishes from "./pages/Dishes";
import OrdersList from "./pages/OrdersList";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/dishes/:id" element={<DishesDetails />} />
            <Route path="/category/:categoryId" element={<CategoryDetails />} />
            <Route path="/dishList" element={<DishList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/orders" element={<OrdersList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
