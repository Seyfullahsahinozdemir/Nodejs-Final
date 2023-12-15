"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  authActions,
  selectIsAuthenticated,
  selectIsAdmin,
} from "@/slices/auth.slice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("movies");

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
  };

  window.onbeforeunload = () => {
    if (localStorage.getItem("rememberMe") !== "true") {
      dispatch(authActions.logout());
    }
  };

  return (
    <nav className="bg-white border-solid border-b-2 border-indigo-600 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/movies" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            MovieApp
          </span>
        </Link>
        {isAuthenticated ? (
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/movies"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "movies"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => setSelectedMenu("movies")}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/talents"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "talents"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => setSelectedMenu("talents")}
                >
                  Talents
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "profile"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => setSelectedMenu("profile")}
                >
                  Profile
                </Link>
              </li>
              {isAdmin ? (
                <li>
                  <Link
                    href="/admin/dashboard"
                    className={`block py-2 pl-3 pr-4 ${
                      selectedMenu == "dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                    }`}
                    aria-current="page"
                    onClick={() => setSelectedMenu("dashboard")}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                ""
              )}

              <li>
                <Link
                  href="/login"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/movies"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "movies"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => setSelectedMenu("movies")}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/talents"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "talents"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => setSelectedMenu("talents")}
                >
                  Talents
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
