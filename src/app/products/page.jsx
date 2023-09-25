"use client";

import { getOneCategory } from "@/fetch/categories";
import { deleteProduct, getAllProducts } from "@/fetch/products";
import { getOneSubCategory } from "@/fetch/subCategories";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const itemsPerPage = 2;
  const router = useRouter();

  const queryParams = {
    id: null,
    name: null,
    SKU: null,
    maxPrice: null,
    minPrice: null,
    limit: itemsPerPage,
    page: currentPage,
    sub_category_id: null,
    category_id: null,
    rating: null,
    q: null,
  };

  const fetchProductCategory = async (category_id, sub_category_id) => {
    try {
      const category = await getOneCategory(category_id);
      const subCategory = await getOneSubCategory(sub_category_id);

      return { categoryName: category.name, subCategoryName: subCategory.name };
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async (params) => {
    try {
      const response = await getAllProducts(params);
      const productsWithCategoryName = await Promise.all(
        response.products.map(async (product) => {
          const { categoryName, subCategoryName } = await fetchProductCategory(
            product.category_id,
            product.sub_category_id
          );

          return { ...product, categoryName, subCategoryName };
        })
      );

      setProducts(productsWithCategoryName);
      setCurrentPage(response.currentPage);
      setPrevPage(response.prevPage);
      setNextPage(response.nextPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProducts = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d80032",
      confirmButtonText: "Yes, delete it!",
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

  useEffect(() => {
    fetchProducts(queryParams);
    setSelectedCheckboxes({});
  }, [currentPage]);

  const handleKeywords = (keywords) => {
    const result = keywords.split(",").map((keyword) => {
      return keyword.trim();
    });

    return result;
  };

  const handleCheckboxChange = (event, productId) => {
    const updatedSelections = { ...selectedCheckboxes };
    updatedSelections[productId] = event.target.checked;
    setSelectedCheckboxes(updatedSelections);
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

  return (
    <div className="max-w-7xl mx-auto mt-5">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex items-center">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
          {Object.values(selectedCheckboxes).some((isChecked) => isChecked) && (
            <button
              type="button"
              data-modal-toggle="delete-product-modal"
              className="inline-flex items-center ml-5 py-2 px-4 text-sm font-medium text-center text-white bg-gradient-to-br from-secondary to-error rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
              onClick={handleDeleteProducts}
            >
              <svg
                className="mr-2 w-5 h-5"
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
        </div>
        <table className="table">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th></th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                SKU
              </th>
              <th scope="col" className="px-6 py-3">
                Keyword
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Sub Category
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.id}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        onChange={(event) =>
                          handleCheckboxChange(event, product.id)
                        }
                      />
                    </label>
                  </th>
                  <td scope="row" className="px-6 whitespace-nowrap">
                    <div className="font-bold">{product.name}</div>
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
                    {product.categoryName}
                  </td>
                  <td className="px-6 whitespace-nowrap">
                    {product.subCategoryName}
                  </td>
                  <td className="px-6 border-b border-blue-gray-50">
                    {product.discount === null ? (
                      <div
                        className="relative inline-block align-baseline font-sans uppercase center whitespace-nowrap rounded-lg select-none bg-gradient-to-tr from-gray-600 to-gray-500 text-white py-0.5 px-2 text-[11px] font-medium"
                        data-projection-id="9"
                        style={{ opacity: 1 }}
                      >
                        <div className="mt-px">inactive</div>
                      </div>
                    ) : (
                      <div
                        className="relative inline-block align-baseline font-sans uppercase center whitespace-nowrap rounded-lg select-none bg-gradient-to-tr from-green-600 to-green-400 text-white py-0.5 px-2 text-[11px] font-medium"
                        data-projection-id="8"
                        style={{ opacity: 1 }}
                      >
                        <div className="mt-px">active</div>
                      </div>
                    )}
                  </td>
                  <th className="px-6 py-4">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => {
                        router.push(`/products/${product.id}`);
                      }}
                    >
                      details
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* CODE FOR PAGINATION!!! */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
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
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
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
                          ? "bg-secondary text-white"
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

      <script src="https://unpkg.com/flowbite@1.3.4/dist/flowbite.js"></script>
    </div>
  );
}
