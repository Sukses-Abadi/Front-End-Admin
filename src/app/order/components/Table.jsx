"use client";

import fetchWithTokenClient from "@/lib/fetchWithTokenClient";
import { deleteCookie, getCookies } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Table() {
  const pathname = usePathname();
  const router = useRouter();
  const [data, setData] = useState();
  const [dateFilter, setDateFilter] = useState("desc");
  const [activeLink, setActiveLink] = useState("");
  const [page, setPage] = useState("");
  const [limit, setLimit] = useState("10");
  const [trackingUpdate, setTrackingUpdate] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let url =
        `cms/order?` +
        `sortOrder=${dateFilter}` +
        `&status=${activeLink}` +
        `&page=${page}` +
        `&limit=${limit}` +
        `&q=${q}`;
      console.log(url);
      const data = await fetchWithTokenClient(url, "GET", {
        cache: "no-store",
      });
      setData(data.data);
    };
    fetchData();
  }, [dateFilter, page, activeLink, limit, trackingUpdate, q]);

  const handleLinkClick = (status) => {
    setActiveLink(status);
    setPage(1);
  };

  const handleSort = async (value) => {
    setDateFilter(value);
    setPage(1);
  };

  const handlePage = async (value) => {
    setPage(value);
  };

  const handleLimit = async (value) => {
    setLimit(value);
    setPage(1);
  };
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setQ(e.target.q.value);
  };

  const handleSubmitTrackingNumber = async (event, order_id) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const tracking_number = event.target.tracking_number.value;
    if (!tracking_number) {
      Swal.fire({ text: "Please enter tracking number" });
      return;
    }
    const body = {
      tracking_number,
      status: "shipped",
    };

    const data = await fetchWithTokenClient(`cms/order/${order_id}`, "PUT", {
      body: JSON.stringify(body),
    });
    if (data.status === "success") {
      Swal.fire({ icon: "success", text: "Success" });
      setTrackingUpdate(tracking_number);
    }
  };

  const renderPageButtons = () => {
    const currentPage = data.currentPage;
    const totalPages = data.totalPages;
    const pageButtons = [];

    // Calculate the range for the first three buttons
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    // Render first three buttons
    for (let i = start; i <= end; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePage(i)}
          className={`relative ${
            currentPage === i
              ? "z-10 bg-indigo-600 text-white"
              : "text-gray-900"
          } inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          {i}
        </button>
      );
    }

    if (totalPages > 6 && currentPage < totalPages - 3) {
      pageButtons.push(
        <span
          key="ellipsis-start"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300"
        >
          ...
        </span>
      );
    }

    // Check if the last two buttons are lined up with the first three buttons
    const lastTwoLinedUp = totalPages <= currentPage + 2;
    // Render last two buttons without ellipsis
    if (!lastTwoLinedUp) {
      for (let i = Math.max(totalPages - 1, 4); i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePage(i)}
            className={`relative ${
              currentPage === i
                ? "z-10 bg-indigo-600 text-white"
                : "text-gray-900"
            } inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
          >
            {i}
          </button>
        );
      }
    }

    return pageButtons;
  };
  if (!data) return;

  return (
    <section className="container mx-auto p-6 font-mono max-sm:text-xs">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative text-gray-600 focus-within:text-gray-400">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </span>
          <input
            type="search order ID"
            name="q"
            className="py-2 text-sm text-white bg-gray-200 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search..."
            autoComplete="off"
          />
          <button className="mx-2 p-2 rounded-sm bg-slate-200 text-sm ">
            Search
          </button>
        </div>
      </form>

      {/* FILTER BY DATE */}
      <div className="px-4 md:px-10 py-4 md:py-7 ">
        <div className="flex items-center justify-between flex-wrap">
          <p
            tabIndex="0"
            className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800"
          >
            Orders
          </p>
          <div className="flex gap-3 flex-wrap">
            <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
              <p>Show Entries:</p>
              <select
                aria-label="select"
                className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
                onChange={(e) => handleLimit(e.target.value)}
                defaultValue={"10"}
              >
                <option value={"5"} className="text-sm text-indigo-800">
                  5
                </option>
                <option value={"10"} className="text-sm text-indigo-800">
                  10
                </option>
                <option value={"20"} className="text-indigo-800">
                  20
                </option>
                <option value={"50"} className="text-indigo-800">
                  50
                </option>
              </select>
            </div>
            <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
              <p>Sort By:</p>
              <select
                aria-label="select"
                className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={"desc"}
              >
                <option value={"desc"} className="text-sm text-indigo-800">
                  Latest
                </option>
                <option value={"asc"} className="text-indigo-800">
                  Oldest
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* STATUS FILTER */}
      <div className="flex gap-1 my-2 items-center flex-wrap">
        <a
          className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ${
            activeLink === "" ? "bg-indigo-100 text-indigo-700" : ""
          }`}
          onClick={() => handleLinkClick("")}
        >
          <div className="py-2 px-8 rounded-full">
            <p>All</p>
          </div>
        </a>
        <a
          className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ${
            activeLink === "waiting" ? "bg-indigo-100 text-indigo-700" : ""
          }`}
          onClick={() => handleLinkClick("waiting")}
        >
          <div className="py-2 px-8 rounded-full">
            <p>Waiting</p>
          </div>
        </a>
        <a
          className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8 ${
            activeLink === "received" ? "bg-indigo-100 text-indigo-700" : ""
          }`}
          onClick={() => handleLinkClick("received")}
        >
          <div className="py-2 px-8 rounded-full">
            <p>Received</p>
          </div>
        </a>
        <a
          className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8 ${
            activeLink === "shipped" ? "bg-indigo-100 text-indigo-700" : ""
          }`}
          onClick={() => handleLinkClick("shipped")}
        >
          <div className="py-2 px-8 rounded-full">
            <p>Shipped</p>
          </div>
        </a>
        <a
          className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8 ${
            activeLink === "complete" ? "bg-indigo-100 text-indigo-700" : ""
          }`}
          onClick={() => handleLinkClick("complete")}
        >
          <div className="py-2 px-8 rounded-full">
            <p>Completed</p>
          </div>
        </a>
      </div>
      {/* TABLE */}
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Total Payment</th>
                <th className="px-4 py-3">Payment Receipt</th>
                <th className="px-4 py-3">Order Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tracking Number</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.orders.map((order) => {
                const bank = order.bankAccount;
                const orderedProducts = order.orderProducts;
                return (
                  <tr key={order.id} className=" text-gray-700">
                    <td className="px-4 py-3 border">{order.id}</td>
                    <td className="px-4 py-3 border">
                      {orderedProducts.map((orderedProduct) => {
                        const productDetails = orderedProduct.ProductDetails;
                        const product = productDetails.product;
                        const photos = product.productGalleries;
                        return (
                          <div
                            key={orderedProduct.id}
                            className="flex-col items-center text-sm"
                          >
                            <Image
                              onClick={() =>
                                router.push(`/product/${product.slug}`)
                              }
                              priority
                              className=" h-32 w-auto rounded-3xl border-gray-200 border transform hover:scale-125"
                              src={`http://localhost:5000/${photos[0].photo}`}
                              alt={product.name}
                              width={200}
                              height={200}
                            />
                            <p
                              className={`h-4 w-4 ml-1 mt-1 border-2 border-stale-500 rounded-full focus:outline-none`}
                              style={{
                                backgroundColor: productDetails.color,
                              }}
                            ></p>
                            <p className=" text-bold">
                              SKU: {productDetails.product.SKU}
                            </p>
                            <p className=" text-bold">
                              Size: {productDetails.size}
                            </p>
                            <p className=" text-bold">
                              Quantity: {orderedProduct.quantity}
                            </p>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-4 py-3 border font-semibold">
                      RP {order.total_payment}
                    </td>
                    <td className="px-4 py-3 border font-semibold">
                      {order.payment_receipt ? (
                        <Image
                          className="w-auto h-auto"
                          onClick={() =>
                            router.push(
                              `http://localhost:5000/${order.payment_receipt}`
                            )
                          }
                          src={`http://localhost:5000/${order.payment_receipt}`}
                          alt={order.payment_receipt}
                          height={200}
                          width={200}
                        />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 border ">{order.order_date}</td>
                    <td className="px-4 py-3 border ">
                      <p
                        className="p-2 rounded-md"
                        defaultValue={order.status}
                        style={{
                          backgroundColor:
                            order.status === "waiting"
                              ? "#8DD1F0"
                              : order.status === "received"
                              ? "#E0C7FE"
                              : order.status === "rejected"
                              ? "#F6AA97"
                              : order.status === "shipped"
                              ? "#DCD7A0"
                              : order.status === "completed"
                              ? "#93EF93"
                              : "Red",
                        }}
                      >
                        {order.status}
                      </p>
                    </td>
                    <td className="p-1 border flex-wrap">
                      {" "}
                      {order.tracking_number || (
                        <form
                          onSubmit={(e) =>
                            handleSubmitTrackingNumber(e, order.id)
                          }
                        >
                          <input
                            className="border "
                            name="tracking_number"
                            placeholder="Tracking Number Here"
                          />
                          <button
                            type="submit"
                            className="p-1 hover:bg-slate-400 bg-slate-100 rounded-md"
                          >
                            Submit
                          </button>
                        </form>
                      )}{" "}
                    </td>
                    <td className="text-center border">
                      <button
                        className="btn"
                        onClick={() =>
                          document.getElementById("my_modal_4").showModal()
                        }
                      >
                        VIEW
                      </button>
                      {/* MODAL <<<<<<<<<<<<<<<<<<<<<< */}
                      <dialog id="my_modal_4" className="modal">
                        <div className="modal-box w-11/12 max-w-5xl">
                          <div className="md:flex md:items-center mb-3 ">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Order Date</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>{order.order_date}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">address</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>
                                {order.address.street},{order.address.zip_code}
                              </p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Total Price</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>Rp. {order.total_price}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              F<p className="font-semibold">Total Weight</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>{order.total_weight} gram</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Courier</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>{order.courier}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Shipping Method</p>
                            </div>
                            <div className="md:w-2/3">
                              <p className="">{order.shipping_method}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Tracking Number</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>{order.tracking_number}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Shipping Cost</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>Rp. {order.shipping_cost}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Total Cost</p>
                            </div>
                            <div className="md:w-2/3">
                              <p>Rp. {order.total_payment}</p>
                            </div>
                          </div>
                          <div className="md:flex md:items-center mb-3">
                            <div className="md:w-1/3 my-2">
                              <p className="font-semibold">Payment Receipt</p>
                            </div>
                            <div className="md:w-2/3">
                              {order.payment_receipt ? (
                                <Image
                                  onClick={() =>
                                    router.push(
                                      `http://localhost:5000/${order.payment_receipt}`
                                    )
                                  }
                                  src={`http://localhost:5000/${order.payment_receipt}`}
                                  alt={order.payment_receipt}
                                  height={200}
                                  width={200}
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button, it will close the modal */}
                              <button className="btn">Close</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* PAGINATION */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(data.currentPage - 1) * data.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {(data.currentPage - 1) * data.limit + 1 + data.limit - 1}
              </span>{" "}
              of <span className="font-medium">{data.totalItems}</span> results
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            {/* ... */}
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePage(data.currentPage - 1)}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  data.currentPage === 1 ? "hidden" : ""
                }`}
              >
                Previous
              </button>

              {renderPageButtons()}

              <button
                onClick={() => handlePage(data.currentPage + 1)}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  data.currentPage === data.totalPages ? "hidden" : ""
                } ${data.totalPages === null ? "hidden" : ""}`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
