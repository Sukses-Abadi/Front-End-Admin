"use client";

import { getAllCategory } from "@/fetch/categories";
import { deleteProduct, getAllProducts } from "@/fetch/products";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState(null);
  const [selectedDiscountStatus, setSelectedDiscountStatus] = useState("");
  const [filteredDiscountStatus, setFilteredDiscountStatus] = useState(null);
  const [selectedRestockStatus, setSelectedRestockStatus] = useState("");
  const [filteredRestockStatus, setFilteredRestockStatus] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState(null);
  const [filteredSortBy, setFilteredSortBy] = useState("created_at");
  const [filteredSortOrder, setFilteredSortOrder] = useState("desc");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [isFilterButtonsChecked, setIsFilterButtonsChecked] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [searchBar, setSearchBar] = useState("");
  const [productLoaded, setProductLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const router = useRouter();

  const queryParams = {
    id: null,
    name: null,
    SKU: null,
    maxPrice: null,
    minPrice: null,
    restockStatus: filteredRestockStatus ? filteredRestockStatus : null,
    discountStatus: filteredDiscountStatus ? filteredDiscountStatus : null,
    limit: itemsPerPage,
    page: currentPage,
    sub_category_id:
      filteredSubCategories?.length === 0 ? null : filteredSubCategories,
    category_id: filteredCategories?.length === 0 ? null : filteredCategories,
    rating: null,
    averageRating: filteredRatings?.length === 0 ? null : filteredRatings,
    q: searchBar,
    sortBy: filteredSortBy,
    sortOrder: filteredSortOrder,
  };

  const fetchProducts = async (params) => {
    try {
      const response = await getAllProducts(params);
      const productsWithCategoryName = response.products
        ? await Promise.all(
            response.products.map(async (product) => {
              const countReviews = product.reviews.length;

              return {
                ...product,
                countReviews,
              };
            })
          )
        : null;

      setProducts(productsWithCategoryName);
      setCurrentPage(response.currentPage);
      setPrevPage(response.prevPage);
      setNextPage(response.nextPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);

      setProductLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();

      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  const delayedSearch = debounce((value) => {
    setSearchBar(value);
  }, 500);

  const handleDeleteProducts = async () => {
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
        const deletedProducts = Object.keys(selectedCheckboxes).filter(
          (key) => selectedCheckboxes[key] === true
        );
        let successfulDeletions = [];

        for (const productId of deletedProducts) {
          try {
            await deleteProduct(productId);
            successfulDeletions.push(productId);
          } catch (error) {
            console.log(`Failed to delete product with ID ${productId}`);
          }
        }

        const updatedCheckboxState = { ...selectedCheckboxes };
        for (const productId of successfulDeletions) {
          delete updatedCheckboxState[productId];
        }
        setSelectedCheckboxes(updatedCheckboxState);
        setSelectAll(false);

        let informationMessage =
          successfulDeletions.length > 0
            ? `Successfully deleted ${successfulDeletions.length} product(s).`
            : "No products were deleted.";

        Swal.fire({
          icon: "info",
          title:
            successfulDeletions.length > 0
              ? "Product(s) Deleted Successfully"
              : "Deletion Failed",
          text: informationMessage,
          showConfirmButton: false,
          showCloseButton: true,
        });

        fetchProducts(queryParams);
      }
    });
  };

  const handleKeywords = (keywords) => {
    const result = keywords.split(",").map((keyword) => {
      return keyword.trim();
    });

    return result;
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    const updatedSelections = {};
    products?.forEach((product) => {
      updatedSelections[product.id] = !selectAll;
    });
    setSelectedCheckboxes(updatedSelections);
  };

  const handleCheckboxChange = (event, productId) => {
    const updatedSelections = { ...selectedCheckboxes };
    updatedSelections[productId] = event.target.checked;
    setSelectedCheckboxes(updatedSelections);

    const allChecked = products.every(
      (product) => updatedSelections[product.id]
    );
    setSelectAll(allChecked);
  };

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

  useEffect(() => {
    const filterButtonsName = [
      "ratingsFilter",
      "categoryFilter",
      "subCategoryFilter",
      "restockStatus",
      "discountStatus",
    ];

    const filterButtonsChecked = filterButtonsName.some((buttonName) => {
      const buttons = document.querySelectorAll(`input[name="${buttonName}"]`);
      return Array.from(buttons).some((button) => button.checked);
    });

    setProductLoaded(false);
    fetchProducts(queryParams);
    fetchCategories();

    setIsFilterButtonsChecked(filterButtonsChecked);
    setSelectedCheckboxes({});
  }, [
    itemsPerPage,
    currentPage,
    searchBar,
    filteredCategories,
    filteredSubCategories,
    filteredDiscountStatus,
    filteredRestockStatus,
    filteredSortBy,
    filteredSortOrder,
    filteredRatings,
  ]);

  return (
    <div className="max-w-7xl mx-auto mt-5">
      <div className="relative shadow-md sm:rounded-lg mb-28">
        <div className="p-4 flex flex-col items-start">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5"
              placeholder="Search for items"
              onChange={(e) => {
                delayedSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex items-start flex-col sm:flex-row mt-3 w-full">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center py-2 pl-2 pr-3 text-sm font-medium text-center text-white bg-gradient-to-br from-orange-300 to-accent rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform whitespace-nowrap"
                onClick={() => router.push("/products/create")}
              >
                <svg
                  className="mr-2 w-5 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Add product
              </button>
              {Object.values(selectedCheckboxes).some(
                (isChecked) => isChecked
              ) && (
                <button
                  type="button"
                  className="inline-flex items-center py-2 pl-2 pr-3 ml-1 text-sm font-medium text-center text-white bg-gradient-to-br from-red-400 to-error rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                  onClick={handleDeleteProducts}
                >
                  <svg
                    className="mr-2 w-5 h-6"
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
                  Delete
                </button>
              )}
              {isFilterButtonsChecked && (
                <button
                  type="button"
                  className="inline-flex items-center ml-1 py-2.5 px-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform whitespace-nowrap"
                  onClick={() => {
                    const filterButtonsName = [
                      "ratingsFilter",
                      "categoryFilter",
                      "subCategoryFilter",
                      "restockStatus",
                      "discountStatus",
                    ];

                    filterButtonsName.forEach((buttonName) => {
                      const buttons = document.querySelectorAll(
                        `input[name="${buttonName}"]`
                      );
                      buttons?.forEach((button) => {
                        button.checked = false;
                      });
                    });

                    setSelectedCategories([]);
                    setSelectedSubCategories([]);
                    setSelectedDiscountStatus(null);
                    setSelectedRestockStatus(null);
                    setSelectedRatings([]);

                    setFilteredCategories(null);
                    setFilteredSubCategories(null);
                    setFilteredDiscountStatus(null);
                    setFilteredRestockStatus(null);
                    setFilteredRatings(null);
                  }}
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="relative inline-block text-left mt-2 sm:mt-0 sm:ml-auto">
              <button
                id="productSortDropdown"
                className="flex items-center justify-center py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10"
                type="button"
                onClick={() => {
                  setIsDropdownOpen((prevState) => ({
                    ...prevState,
                    ["productSortDropdown"]: !prevState["productSortDropdown"],
                  }));
                }}
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500 mr-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                {filteredSortOrder === "asc" ? "Oldest" : "Latest"}
                <svg
                  className="-mr-1 ml-1.5 w-5 h-5"
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
                  isDropdownOpen["productSortDropdown"] ? "block" : "hidden"
                } absolute z-10 ml-2 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow`}
                style={{ maxWidth: "128px" }}
              >
                <ul className="p-2 text-sm text-gray-700 cursor-pointer">
                  {["Latest", "Oldest"].map((option) => (
                    <li key={option}>
                      <div
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                        onClick={() => {
                          setFilteredSortBy("created_at");
                          setFilteredSortOrder(
                            option === "Latest" ? "desc" : "asc"
                          );

                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            ["productSortDropdown"]:
                              !prevState["productSortDropdown"],
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
        </div>
        <div
          className="overflow-x-auto"
          style={{ minHeight: "200px", maxHeight: "500px" }}
        >
          <table className="table">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50">
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                  <div className="dropdown">
                    <button
                      tabIndex={0}
                      className="filter-button m-0.5 p-1 rounded-sm hover:text-white hover:bg-accent hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-32"
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
                                    setSelectedRatings([
                                      ...selectedRatings,
                                      index + 1,
                                    ]);
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
                            setCurrentPage(1);
                            setFilteredRatings(selectedRatings);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3">
                  Keyword
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="filter-button m-0.5 p-1 rounded-sm hover:text-white hover:bg-accent hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52"
                    >
                      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                        {categories?.map((category) => {
                          return (
                            <label
                              key={category.id}
                              className="flex items-center text-gray-600"
                              style={{ textTransform: "none" }}
                            >
                              <input
                                type="checkbox"
                                value={category.name}
                                name="categoryFilter"
                                className="mr-1 block"
                                onChange={() => {
                                  if (
                                    selectedCategories.includes(category.id)
                                  ) {
                                    const newArray = selectedCategories.filter(
                                      (item) => item !== category.id
                                    );
                                    setSelectedCategories(newArray);
                                  } else {
                                    setSelectedCategories([
                                      ...selectedCategories,
                                      category.id,
                                    ]);
                                  }
                                }}
                              />
                              {category.name}
                            </label>
                          );
                        })}
                      </div>
                      {categories && (
                        <div className="flex items-center justify-between mt-2">
                          <button
                            type="button"
                            className="w-1/4 mt-2 py-0.5 text-white  font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-error hover:scale-[1.01] transition-all"
                            style={{ fontSize: "13px" }}
                            onClick={() => {
                              const checkboxes = document.querySelectorAll(
                                'input[name="categoryFilter"]'
                              );
                              checkboxes?.forEach((checkbox) => {
                                checkbox.checked = false;
                              });

                              setSelectedCategories([]);
                            }}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="w-1/4 mt-2 ml-auto py-0.5 text-white font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-accent hover:scale-[1.01] transition-all"
                            style={{ fontSize: "13px" }}
                            onClick={() => {
                              setCurrentPage(1);
                              setFilteredCategories(selectedCategories);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Sub Category
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="filter-button m-0.5 p-1 rounded-sm hover:text-white hover:bg-accent hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52"
                    >
                      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                        {categories
                          ?.filter((category) =>
                            filteredCategories?.includes(category.id)
                          )
                          ?.map((category, index) => (
                            <div key={category.id}>
                              {index === 0 ? (
                                <div>{category.name}</div>
                              ) : (
                                <div className="mt-3">{category.name}</div>
                              )}
                              <hr className="border-t border-slate-700 mb-1" />
                              {category.SubCategory.map((subCategory) => (
                                <label
                                  key={subCategory.id}
                                  className="flex items-center text-gray-600"
                                  style={{ textTransform: "none" }}
                                >
                                  <input
                                    type="checkbox"
                                    value={subCategory.name}
                                    name="subCategoryFilter"
                                    className="mr-1 block"
                                    onChange={() => {
                                      if (
                                        selectedSubCategories.includes(
                                          subCategory.id
                                        )
                                      ) {
                                        const newArray =
                                          selectedSubCategories.filter(
                                            (item) => item !== subCategory.id
                                          );
                                        setSelectedSubCategories(newArray);
                                      } else {
                                        setSelectedSubCategories([
                                          ...selectedSubCategories,
                                          subCategory.id,
                                        ]);
                                      }
                                    }}
                                  />
                                  {subCategory.name}
                                </label>
                              ))}
                            </div>
                          ))}
                      </div>
                      {filteredCategories && filteredCategories.length > 0 && (
                        <div className="flex items-center justify-between mt-2">
                          <button
                            type="button"
                            className="w-1/4 mt-2 py-0.5 text-white  font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-error hover:scale-[1.01] transition-all"
                            style={{ fontSize: "13px" }}
                            onClick={() => {
                              const checkboxes = document.querySelectorAll(
                                'input[name="subCategoryFilter"]'
                              );
                              checkboxes?.forEach((checkbox) => {
                                checkbox.checked = false;
                              });

                              setSelectedSubCategories([]);
                            }}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="w-1/4 mt-2 ml-auto py-0.5 text-white font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-accent hover:scale-[1.01] transition-all"
                            style={{ fontSize: "13px" }}
                            onClick={() => {
                              setCurrentPage(1);
                              setFilteredSubCategories(selectedSubCategories);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Restock
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="filter-button m-0.5 p-1 rounded-sm hover:text-white hover:bg-accent hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52"
                    >
                      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                        {["True", "False"].map((status, index) => {
                          return (
                            <label
                              key={index}
                              className="flex items-center text-gray-600"
                              style={{ textTransform: "none" }}
                            >
                              <input
                                type="radio"
                                value={status}
                                name="restockStatus"
                                className="mr-1 block"
                                onChange={(e) => {
                                  const status =
                                    e.target.value === "True"
                                      ? "true"
                                      : "false";

                                  setSelectedRestockStatus(status);
                                }}
                                checked={
                                  selectedRestockStatus ===
                                  (status === "True" ? "true" : "false")
                                }
                              />
                              {status}
                            </label>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="button"
                          className="w-1/4 mt-2 py-0.5 text-white  font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-error hover:scale-[1.01] transition-all"
                          style={{ fontSize: "13px" }}
                          onClick={() => {
                            const radioButtons = document.querySelectorAll(
                              'input[name="restockStatus"]'
                            );
                            radioButtons?.forEach((radio) => {
                              radio.checked = false;
                            });

                            setSelectedRestockStatus(null);
                          }}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="w-1/4 mt-2 ml-auto py-0.5 text-white font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-accent hover:scale-[1.01] transition-all"
                          style={{ fontSize: "13px" }}
                          onClick={() => {
                            setCurrentPage(1);
                            setFilteredRestockStatus(selectedRestockStatus);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Discount
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="filter-button m-0.5 p-1 rounded-sm hover:text-white hover:bg-accent hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52"
                    >
                      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                        {["Active", "Inactive"].map((status, index) => {
                          return (
                            <label
                              key={index}
                              className="flex items-center text-gray-600"
                              style={{ textTransform: "none" }}
                            >
                              <input
                                type="radio"
                                value={status}
                                name="discountStatus"
                                className="mr-1 block"
                                onChange={(e) => {
                                  const status =
                                    e.target.value === "Active"
                                      ? "true"
                                      : "false";

                                  setSelectedDiscountStatus(status);
                                }}
                                checked={
                                  selectedDiscountStatus ===
                                  (status === "Active" ? "true" : "false")
                                }
                              />
                              {status}
                            </label>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="button"
                          className="w-1/4 mt-2 py-0.5 text-white  font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-error hover:scale-[1.01] transition-all"
                          style={{ fontSize: "13px" }}
                          onClick={() => {
                            const radioButtons = document.querySelectorAll(
                              'input[name="discountStatus"]'
                            );
                            radioButtons?.forEach((radio) => {
                              radio.checked = false;
                            });

                            setSelectedDiscountStatus(null);
                          }}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="w-1/4 mt-2 ml-auto py-0.5 text-white font-medium text-center rounded-md shadow-sm shadow-gray-300 bg-accent hover:scale-[1.01] transition-all"
                          style={{ fontSize: "13px" }}
                          onClick={() => {
                            setCurrentPage(1);
                            setFilteredDiscountStatus(selectedDiscountStatus);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!productLoaded ? (
                <tr className="border-none">
                  <td>Loading...</td>
                </tr>
              ) : (
                products?.map((product) => {
                  return (
                    <tr key={product.id}>
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedCheckboxes[product.id] || false}
                            onChange={(event) =>
                              handleCheckboxChange(event, product.id)
                            }
                          />
                        </label>
                      </th>
                      <td scope="row" className="px-6 whitespace-nowrap">
                        <div className="font-bold">{product.name}</div>
                        {product.averageRating && (
                          <div
                            className="text-gray-600"
                            style={{ textTransform: "none", fontSize: "13px" }}
                          >
                            ★{product.averageRating}
                            <svg
                              className="humbleicons hi-circle inline w-1.5 h-1.5 mx-1 mb-0.5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              stroke="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                xmlns="http://www.w3.org/2000/svg"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <a
                              className="hover:text-blue-500"
                              href={`/products/${product.id}/reviews`}
                            >
                              {product.countReviews} Reviews
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 whitespace-nowrap">{product.SKU}</td>
                      <td className="px-6">
                        {handleKeywords(product.keyword).map((item, index) => {
                          return (
                            <span
                              key={index}
                              className="badge badge-ghost badge-sm whitespace-nowrap"
                            >
                              {item}
                            </span>
                          );
                        })}
                      </td>
                      <td className="px-6 whitespace-nowrap">
                        {product.Category.name}
                      </td>
                      <td className="px-6 whitespace-nowrap">
                        {product.SubCategory.name}
                      </td>
                      <td className="px-6 whitespace-nowrap">
                        {product.productDetails.some(
                          (detail) => detail.stock === 0
                        ) && (
                          <div
                            className="relative inline-block align-baseline font-sans uppercase center whitespace-nowrap rounded-lg select-none bg-error text-white text-center w-20 py-1 px-2 text-[11px] font-medium"
                            data-projection-id="10"
                            style={{ opacity: 1 }}
                          >
                            <div className="my-px">restock</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 border-b border-blue-gray-50">
                        {product.discount === null ? (
                          <div
                            className="relative inline-block align-baseline font-sans uppercase center whitespace-nowrap rounded-lg select-none bg-gradient-to-tr from-gray-600 to-gray-500 text-white text-center w-20 py-1 px-2 text-[11px] font-medium"
                            data-projection-id="9"
                            style={{ opacity: 1 }}
                          >
                            <div className="my-px">inactive</div>
                          </div>
                        ) : (
                          <div
                            className="relative inline-block align-baseline font-sans uppercase center whitespace-nowrap rounded-lg select-none bg-gradient-to-tr from-green-700 to-green-500 text-white text-center w-20 py-1 px-2 text-[11px] font-medium"
                            data-projection-id="8"
                            style={{ opacity: 1 }}
                          >
                            <div className="my-px">active</div>
                          </div>
                        )}
                      </td>
                      <th className="px-6 py-4">
                        <button
                          type="button"
                          className="inline-flex items-center py-1 px-3 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg shadow-md  hover:bg-gray-300 hover:text-gray-900 hover:scale-[1.02] transition-all"
                          onClick={() => {
                            router.push(`/products/${product.id}/edit`);
                          }}
                        >
                          <svg
                            className="mr-2 w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path
                              fillRule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Edit
                        </button>
                      </th>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* CODE FOR PAGINATION!!! */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
                  <ul className="py-1 text-sm text-gray-700 cursor-pointer">
                    {[2, 10, 20, 50].map((option) => (
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
