"use client";

import { getAllCategory } from "@/fetch/categories";
import { useEffect, useState } from "react";

export default function Page() {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [weight, setWeight] = useState(0);
  const [discount, setDiscount] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("S");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUpload, setImageUpload] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();

      setCategories(response);
      setSelectedCategory(response[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 5) {
      setUploadError("You can only upload a maximum of 5 images.");
      return;
    }

    setUploadError("");

    const fileArray = files?.map((file) => ({
      previewURL: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImageFiles([...imageFiles, ...fileArray]);
    setImageUpload([...imageUpload, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImageFiles = [...imageFiles];
    const updatedImageUpload = [...imageUpload];

    updatedImageFiles.splice(index, 1);
    updatedImageUpload.splice(index, 1);

    setImageFiles(updatedImageFiles);
    setImageUpload(updatedImageUpload);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    imageUpload.forEach((imageObj) => {
      formData.append("files", imageObj);
    });

    try {
      const imageList = await uploadFiles(formData);
      const paramsObj = {
        name: productName,
        SKU: sku,
        description,
        keyword: keywords,
        discount: +discount,
        weight: +weight,
        category_id: +selectedCategory,
        sub_category_id: +selectedSubCategory,
        product_galleries: imageList,
        product_details: productDetails,
      };

      await createProduct(paramsObj);

      Swal.fire({
        icon: "success",
        title: "Product Added Successfully",
        text: "The new product has been added to the database.",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/products");
    } catch (error) {
      console.log("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Product",
        text: "Oops! Something went wrong while adding the new product.",
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
                  onChange={handleCategoryChange}
                  required
                >
                  {categories.map((category) => {
                    return (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
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
                  {categories
                    .find((category) => category.name === selectedCategory)
                    ?.SubCategory.map((subCategory) => {
                      return (
                        <option key={subCategory.id} value={subCategory.name}>
                          {subCategory.name}
                        </option>
                      );
                    })}
                  {/* <option value="T-shirt Long Sleeve">
                    T-shirt Long Sleeve
                  </option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jacket">Jacket</option> */}
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
                          <input
                            type="text"
                            name="color"
                            id="color"
                            className="w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="Black"
                            required
                          />
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
                            className="text-white font-medium text-sm px-2.5 py-0.5 my-0.5  text-center rounded-lg bg-gradient-to-br from-orange-300 to-accent shadow-sm shadow-gray-300 hover:scale-[1.02] transition-transform"
                            onClick={() => {
                              setProductDetails((prevDetails) => [
                                ...prevDetails,
                                {
                                  color,
                                  size,
                                  price: +price,
                                  stock: +stock,
                                },
                              ]);
                            }}
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
                      Select an image to upload
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
