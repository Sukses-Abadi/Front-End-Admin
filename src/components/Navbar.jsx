"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("adminAccessToken");
    router.push("/login");
  };

  return (
    <div className="navbar bg-secondary">
      <div className="flex-none">
        <div className="drawer bg-secondary ">
          <input
            id="my-drawer"
            type="checkbox"
            className="bg-secondary drawer-toggle"
          />
          <div className="btn btn-square btn-ghost">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className="btn btn-secondary drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              {/* Sidebar content here */}
              <li>
                <Link href="/products">Product</Link>
              </li>
              <li>
                <Link href="/order">Order</Link>
              </li>
              <li>
                <Link href="/category">Category</Link>
              </li>
              <li>
                <Link href="/shop-details">Shop Details</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">SA-Apparel</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
