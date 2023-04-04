import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

function Nav() {
  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex items-center">
          <li>
            <Link
              to="/orderHistory"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
            >
              Order History
            </Link>
          </li>
          <li className="ml-4">
            {/* this is not using the Link component to logout or user and then refresh the application to the start */}
            <a
              href="/"
              onClick={() => Auth.logout()}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
            >
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex items-center">
          <li>
            <Link
              to="/signup"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
            >
              Signup
            </Link>
          </li>
          <li className="ml-4">
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
            >
              Login
            </Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <header className="bg-[#F8D1E2] shadow-sm fixed w-full top-0">
  <nav className="container mx-auto px-4">
    <div className="flex justify-between h-16">
      <div className="flex-shrink-0 flex items-center">
        <Link
          to="/"
          className="flex items-center font-bold text-gray-800 uppercase tracking-wider"
        >
          <span role="img" aria-label="shopping bag" className="mr-2">
            🛍️
          </span>
          Party Planner Paperie
        </Link>
      </div>
      <div className="hidden md:block">
        {showNavigation()}
      </div>
    </div>
  </nav>
</header>

  );
}

export default Nav;
