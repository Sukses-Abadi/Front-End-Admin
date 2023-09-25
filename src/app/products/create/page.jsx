"use client";

export default function Page() {
  const handleSubmit = async () => {
    try {
      console.log("HOLA AMIGOS");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-5">
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-start p-5 rounded-t border-b">
          <h3 className="text-xl font-semibold">Add product</h3>
        </div>
        <div className="p-6 space-y-6">
          <form action="#">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="product-name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="product-name"
                  id="product-name"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="Long Sleeve T-shirt"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="sku"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="LS1001"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  required
                >
                  <option value="Top">Top</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Outerwear">Outerwear</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="sub-category"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Sub Category
                </label>
                <select
                  name="sub-category"
                  id="sub-category"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  required
                >
                  <option value="T-shirt Long Sleeve">
                    T-shirt Long Sleeve
                  </option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jacket">Jacket</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="weight"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Weight (gram)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="0"
                  min="0" // Set minimum value to 0 to prevent negative values
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="discount"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Discount (Rp)
                </label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="0"
                  min="0" // Set minimum value to 0 to prevent negative values
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="keyword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Keyword
                </label>
                <input
                  type="text"
                  name="keyword"
                  id="keyword"
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="t-shirt, long sleeve"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="product-description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="product-description"
                  rows="3"
                  className="block p-2.5 w-full text-gray-900 border border-gray-300 sm:text-sm rounded-lg focus:ring-orange-300 focus:border-accent"
                  placeholder="e.g. Comfortable long sleeve t-shirt for all occasions."
                  required
                ></textarea>
              </div>
              <div className="col-span-6">
                <hr className="mb-5 border-t border-gray-200" />
                <label
                  htmlFor="product-details"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Product Details
                </label>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-b border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 border-y border-gray-200">
                        <th className="py-1 px-4 text-left text-sm w-1/4">
                          Color
                        </th>
                        <th className="py-1 px-4 text-left text-sm w-1/4">
                          Size
                        </th>
                        <th className="py-1 px-4 text-left text-sm w-1/4">
                          Price (Rp)
                        </th>
                        <th className="py-1 px-4 text-left text-sm w-1/4">
                          Stock
                        </th>
                        <th className="py-2 px-4 text-left text-sm"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name="color"
                            id="color"
                            className="w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            required
                          >
                            <option value="Black">Black</option>
                            <option value="White">White</option>
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                          </select>
                        </td>
                        <td>
                          <select
                            name="size"
                            id="size"
                            className="w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            required
                          >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            className="w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="0"
                            min="0" // Set minimum value to 0 to prevent negative values
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="stock"
                            id="stock"
                            className="w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="0"
                            min="0" // Set minimum value to 0 to prevent negative values
                            required
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="text-white font-medium text-sm px-2.5 py-1 text-center rounded-lg bg-gradient-to-br from-orange-300 to-accent shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="product-images"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Product Images
                </label>
                <label className="flex flex-col w-full h-32 rounded border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    <p className="py-1 text-sm text-gray-600">
                      Upload a file or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="p-6 rounded-b border-t border-gray-200">
          <button
            className="text-white font-medium text-sm px-5 py-2.5 text-center rounded-lg bg-gradient-to-br from-orange-300 to-accent shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
            type="submit"
            onClick={handleSubmit}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
