"use client";

import { deleteReview, getAllReviews } from "@/fetch/reviews";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import Image from "next/image";

export default function ProductReview({ params }) {
  const { id: productId } = params;

  const [reviews, setReviews] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const queryParams = {
    product_id: productId,
    limit: itemsPerPage,
    page: currentPage,
    rating: filteredRatings?.length === 0 ? null : filteredRatings,
  };

  const fetchReviews = async (params) => {
    try {
      const response = await getAllReviews(params);

      setReviews(response.reviews);
      setCurrentPage(response.currentPage);
      setPrevPage(response.prevPage);
      setNextPage(response.nextPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);

      setReviewLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  function generateStarRating(rating) {
    const maxRating = 5; // Assuming a maximum of 5 stars
    const filledStars = Math.round(rating);
    const emptyStars = maxRating - filledStars;

    const filledStarPaths = Array(filledStars)
      .fill()
      .map((_, index) => (
        <svg
          key={`filledStar-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="humbleicons hi-star w-5 h-5"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545L12 17l-5.878 3.09 1.123-6.545L2.489 8.91l6.572-.955L12 2z"
          />
        </svg>
      ));

    const emptyStarPaths = Array(emptyStars)
      .fill()
      .map((_, index) => (
        <svg
          key={`emptyStar-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="humbleicons hi-star w-5 h-5"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545L12 17l-5.878 3.09 1.123-6.545L2.489 8.91l6.572-.955L12 2z"
          />
        </svg>
      ));

    return [...filledStarPaths, ...emptyStarPaths];
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract date, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because months are 0-based
    const year = date.getFullYear();

    // Format the time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}-${month}-${year} ${hours}:${formattedMinutes}`;
  }

  const generatePageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const middlePage = Math.min(Math.max(2, currentPage), totalPages - 1);

    for (let i = middlePage - 1; i <= middlePage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handleDeleteReview = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d80032",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteReview(id);

          Swal.fire({
            icon: "info",
            text: "Review Deleted Successfully",
            showConfirmButton: false,
            showCloseButton: true,
          });
        } catch (error) {
          console.log(`Failed to delete review with ID ${id}`);
          Swal.fire({
            icon: "info",
            text: "Deletion Failed",
            showConfirmButton: false,
            showCloseButton: true,
          });
        }

        fetchReviews(queryParams);
      }
    });
  };

  useEffect(() => {
    setReviewLoaded(false);
    fetchReviews(queryParams);
  }, [itemsPerPage, currentPage, filteredRatings, queryParams]);

  return (
    <div className="py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center">
      <div className="flex flex-col justify-start items-start w-full space-y-5">
        <div className="flex justify-start items-center w-full">
          <p className="text-2xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
            Reviews
          </p>
          <div className="relative inline-block text-left ml-auto">
            <button
              id="ratingFilterDropdown"
              className="flex items-center justify-center py-2.5 px-3 ml-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10"
              type="button"
              onClick={() => {
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  ["ratingFilterDropdown"]: !prevState["ratingFilterDropdown"],
                }));
              }}
            >
              Ratings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="humbleicons hi-star w-4 h-4 mt-0.5 ml-0.5"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545L12 17l-5.878 3.09 1.123-6.545L2.489 8.91l6.572-.955L12 2z"
                />
              </svg>
              <svg
                className="-mr-1 ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>
            <div
              className={`${
                isDropdownOpen["ratingFilterDropdown"] ? "block" : "hidden"
              } absolute z-10 ml-2 mt-1 w-32 bg-base-100 rounded-md shadow dropdown-content menu p-2`}
            >
              <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                {["★1", "★2", "★3", "★4", "★5"].map((status, index) => {
                  return (
                    <label
                      key={index}
                      className="flex items-center"
                      style={{ textTransform: "none" }}
                    >
                      <input
                        type="checkbox"
                        value={status}
                        name="ratingsFilter"
                        className="mr-1 block"
                        onChange={() => {
                          if (selectedRatings.includes(index + 1)) {
                            const newArray = selectedRatings.filter(
                              (item) => item !== index + 1
                            );
                            setSelectedRatings(newArray);
                          } else {
                            setSelectedRatings([...selectedRatings, index + 1]);
                          }
                        }}
                      />
                      {status}
                    </label>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  className="w-2/5 mt-2 py-0.5 text-white  font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-error hover:scale-[1.01] transition-all"
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    const checkboxes = document.querySelectorAll(
                      'input[name="ratingsFilter"]'
                    );
                    checkboxes?.forEach((checkbox) => {
                      checkbox.checked = false;
                    });

                    setSelectedRatings([]);
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="w-2/5 mt-2 ml-auto py-0.5 text-white font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-accent hover:scale-[1.01] transition-all"
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    setFilteredRatings(selectedRatings);
                    setCurrentPage(1);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-start flex-col bg-gray-50 px-8 py-5">
          {!reviewLoaded ? (
            <div>Loading...</div>
          ) : (
            reviews?.map((review, index) => {
              return (
                <div key={review.id} className="w-full">
                  {index !== 0 && (
                    <hr className="border-t border-gray-200 my-3" />
                  )}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex ml-auto">
                      {generateStarRating(review.rating)}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <svg
                        className="ml-3 w-5 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div id="menu2" className="hidden md:block">
                    <p className="mt-3 text-base leading-normal text-gray-800 w-full md:w-9/12 xl:w-5/6">
                      {review.review_text}
                    </p>
                    <div className="mt-4 flex flex-row justify-start items-start space-x-4">
                      {review.image && (
                        <div>
                          <Image
                            width={150}
                            height={150}
                            src={`http://localhost:5000/${review.image}`}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex justify-start items-center flex-row mb-2">
                      {review.user.photo && (
                        <div>
                          <Image
                            width={100}
                            height={100}
                            src={`http://localhost:5000/${review.user.photo}`}
                            className="w-9 h-9 mr-2.5 rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            alt=""
                          />
                        </div>
                      )}

                      <div className="flex flex-col justify-start items-start space-y-2">
                        <p className="text-sm font-medium leading-none text-gray-900">
                          {review.user.username}
                        </p>
                        <p className="text-xs leading-none text-gray-700">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center justify-between whitespace-nowrap">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {prevPage * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {(prevPage + 1) * itemsPerPage}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> results
              </p>
              {/* Add the show entries button here */}
              <div className="relative inline-block text-left">
                <div className="flex items-center justify-center py-1.5 px-2 ml-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 focus:z-10">
                  <div className="flex font-normal text-sm text-gray-700">
                    Show:
                    <button
                      id="entriesPerPageDropdown"
                      className="font-medium pl-1 hover:bg-gray-100 hover:text-primary-700 rounded-md"
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen((prevState) => ({
                          ...prevState,
                          ["entriesPerPageDropdown"]:
                            !prevState["entriesPerPageDropdown"],
                        }));
                      }}
                    >
                      {itemsPerPage}
                      <svg
                        className="w-4 h-4 inline-block"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                    Entries
                  </div>
                </div>
                <div
                  className={`${
                    isDropdownOpen["entriesPerPageDropdown"]
                      ? "block"
                      : "hidden"
                  } absolute z-10 ml-11 mt-0.5 bg-white divide-y divide-gray-100 rounded-sm shadow`}
                  style={{ maxWidth: "128px" }}
                >
                  <ul className="py-1 text-sm cursor-pointer">
                    {[1, 5, 10, 20].map((option) => (
                      <li key={option}>
                        <div
                          className={`flex items-center rounded-sm px-4 ${
                            itemsPerPage === option
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setCurrentPage(1);
                            setItemsPerPage(option);
                            setIsDropdownOpen((prevState) => ({
                              ...prevState,
                              ["entriesPerPageDropdown"]:
                                !prevState["entriesPerPageDropdown"],
                            }));
                          }}
                        >
                          {option}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm mt-2 sm:mt-0"
                aria-label="Pagination"
              >
                <a
                  onClick={() => {
                    if (prevPage !== null) {
                      setCurrentPage(prevPage);
                    }
                  }}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    prevPage === null ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </a>
                {generatePageNumbers(totalPages, currentPage).map(
                  (pageNumber) => (
                    <a
                      key={pageNumber}
                      aria-current={
                        currentPage === pageNumber ? "page" : undefined
                      }
                      className={`relative z-10 inline-flex items-center px-4 py-2 text-xs font-semibold ${
                        currentPage === pageNumber
                          ? "bg-red-400 text-white"
                          : "text-gray-900 hover:bg-gray-50"
                      } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                      onClick={() => {
                        setCurrentPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </a>
                  )
                )}
                <a
                  onClick={() => {
                    if (nextPage !== null) {
                      setCurrentPage(nextPage);
                    }
                  }}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    nextPage === null ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
