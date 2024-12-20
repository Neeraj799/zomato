import React from "react";

const Navbar = () => {
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "/signIn"; // Or wherever your login page is located
  };
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Dishes</a>
              </li>
              <li>
                <a>Category</a>
              </li>

              <li>
                <a>Modifiers</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Zomato</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/dishes">Dishes</a>
            </li>
            <li>
              <a href="/orders">Orders</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a href="/cart" className="btn">
            Cart
          </a>

          <button onClick={handleLogout} className="btn btn-ghost">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
