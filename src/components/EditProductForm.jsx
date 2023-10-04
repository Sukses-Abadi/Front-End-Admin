"use client";

import ImagePreview from "@/components/ImagePreview";
import { getAllCategory } from "@/fetch/categories";
import { uploadFiles } from "@/fetch/files";
import { addProductDetail, deleteProductDetail } from "@/fetch/productDetails";
import { addProductImage, deleteProductImage } from "@/fetch/productGalleries";
import { getSingleProduct, updateProduct } from "@/fetch/products";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditProductForm({ params }) {
  const { id } = params;

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
  const [productGalleries, setProductGalleries] = useState([]);
  const [imageUpload, setImageUpload] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [productLoaded, setProductLoaded] = useState(false);

  const [newProductDetails, setNewProductDetails] = useState([]);
  const [updatedProductDetails, setUpdatedProductDetails] = useState([]);
  const [deletedDetails, setDeletedDetails] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const router = useRouter();

  const fetchProduct = async () => {
    try {
      const product = await getSingleProduct(id);

      setProductName(product.name);
      setSku(product.SKU);
      setSelectedCategory(product.category_id);
      setSelectedSubCategory(product.sub_category_id);
      setWeight(product.weight);
      setDiscount(product.discount);
      setKeywords(product.keyword);
      setDescription(product.description);
      setProductDetails(product.productDetails);
      setProductGalleries(product.productGalleries);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imagePreview.length + files.length > 5) {
      setUploadError("You can only upload a maximum of 5 images.");
      return;
    }

    setUploadError("");

    const fileArray = files?.map((file) => ({
      previewURL: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImagePreview([...imagePreview, ...fileArray]);
    setImageUpload([...imageUpload, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImagePreview = [...imagePreview];
    const updatedImageUpload = [...imageUpload];

    updatedImagePreview.splice(index, 1);
    updatedImageUpload.splice(index, 1);

    setImagePreview(updatedImagePreview);
    setImageUpload(updatedImageUpload);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    imageUpload?.forEach((imageObj) => {
      formData.append("files", imageObj);
    });

    // add ProductGalleries (if any)
    try {
      const imageList = await uploadFiles(formData);

      imageList?.map(async (image) => {
        await addProductImage(id, image);
      });
    } catch (error) {
      console.log("Error:", error);
    }

    // delete ProductGalleries (if any)
    deletedImages?.map(async (productImagesId) => {
      try {
        await deleteProductImage(productImagesId);
      } catch (error) {
        console.log(
          `Failed to delete product image with ID ${productImagesId}`
        );
      }
    });

    // add ProductDetails (if any)
    newProductDetails?.map(async (productDetails, index) => {
      try {
        await addProductDetail(id, productDetails);
      } catch (error) {
        console.log(`Failed to create product detail with index ${index}`);
      }
    });

    // delete ProductDetails (if any)
    deletedDetails?.map(async (productDetailsId) => {
      try {
        await deleteProductDetail(productDetailsId);
      } catch (error) {
        console.log(
          `Failed to delete product detail with ID ${productDetailsId}`
        );
      }
    });

    try {
      const paramsObj = {
        name: productName,
        SKU: sku,
        description,
        keyword: keywords,
        discount: discount ? (+discount === 0 ? null : +discount) : null,
        weight: +weight,
        category_id: +selectedCategory,
        sub_category_id: +selectedSubCategory,
        product_details: updatedProductDetails,
      };

      await updateProduct(id, paramsObj);

      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully",
        text: "The product has been successfully updated.",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/products");
    } catch (error) {
      console.log("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update Product",
        text: "Oops! Something went wrong while updating the product.",
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  if (!productLoaded) {
    return <div className="ml-2 mt-2">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-5">
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-start p-5 rounded-t border-b">
          <h3 className="text-xl font-semibold">Edit product</h3>
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
                  value={productName ? productName : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="Long Sleeve T-shirt"
                  onChange={(e) => setProductName(e.target.value)}
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
                  value={sku ? sku : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="LS1001"
                  onChange={(e) => setSku(e.target.value)}
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
                  value={selectedCategory ? selectedCategory : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  onChange={(e) => {
                    const subCategory = categories?.find(
                      (category) => category.id === +e.target.value
                    )?.SubCategory[0].id;

                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory(subCategory);
                  }}
                  required
                >
                  {categories?.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
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
                  value={selectedSubCategory ? selectedSubCategory : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  required
                >
                  {categories
                    ?.find((category) => category.id === +selectedCategory)
                    ?.SubCategory?.map((subCategory) => {
                      return (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      );
                    })}
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
                  value={weight ? weight : 0}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="0"
                  min="0" // Set minimum value to 0 to prevent negative values
                  onChange={(e) => setWeight(e.target.value)}
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
                  value={discount ? discount : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="0"
                  min="0" // Set minimum value to 0 to prevent negative values
                  onChange={(e) => setDiscount(e.target.value)}
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
                  value={keywords ? keywords : ""}
                  className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent block w-full p-2.5"
                  placeholder="t-shirt, long sleeve"
                  onChange={(e) => setKeywords(e.target.value)}
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
                  value={description ? description : ""}
                  rows="3"
                  className="block p-2.5 w-full text-gray-900 border border-gray-300 sm:text-sm rounded-lg focus:ring-orange-300 focus:border-accent"
                  placeholder="e.g. Comfortable long sleeve t-shirt for all occasions."
                  onChange={(e) => setDescription(e.target.value)}
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
                  <table className="min-w-full border-gray-200">
                    <thead className="text-sm text-left text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="bg-gray-100 border-y border-gray-200">
                        <th scope="col" className="py-1 px-4 w-1/4">
                          Color
                        </th>
                        <th scope="col" className="py-1 px-4 w-1/4">
                          Size
                        </th>
                        <th scope="col" className="py-1 px-4 w-1/4">
                          Price (Rp)
                        </th>
                        <th scope="col" className="py-1 px-4 w-1/4">
                          Stock
                        </th>
                        <th scope="col" className="py-1 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetails?.map((detail, index) => {
                        return (
                          <tr key={index} className="border-y">
                            <td className="text-sm px-4 whitespace-nowrap">
                              {detail.color}
                            </td>
                            <td className="text-sm px-4 whitespace-nowrap">
                              {detail.size}
                            </td>
                            <td className="text-sm px-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={detail.price ? detail.price : 0}
                                className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                                min="0" // Set minimum value to 0 to prevent negative values
                                onChange={(e) => {
                                  {
                                    const updatedPrice = detail;
                                    updatedPrice.price = +e.target.value;

                                    const updatedDetails = [
                                      ...updatedProductDetails,
                                    ];
                                    updatedDetails[index] = updatedPrice;

                                    setUpdatedProductDetails(updatedDetails);
                                  }
                                }}
                              />
                            </td>
                            <td className="text-sm px-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={detail.stock ? detail.stock : 0}
                                className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                                min="0" // Set minimum value to 0 to prevent negative values
                                onChange={(e) => {
                                  {
                                    const updatedStock = detail;
                                    updatedStock.stock = +e.target.value;

                                    const updatedDetails = [
                                      ...updatedProductDetails,
                                    ];
                                    updatedDetails[index] = updatedStock;

                                    setUpdatedProductDetails(updatedDetails);
                                  }
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="text-white font-medium text-sm px-2.5 py-0.5 my-0.5  text-center rounded-lg bg-gradient-to-br from-red-400 to-error shadow-sm shadow-gray-300 hover:scale-[1.02] transition-transform"
                                onClick={() => {
                                  const updatedDetails = productDetails.filter(
                                    (_, prevIndex) => prevIndex !== index
                                  );

                                  setProductDetails(updatedDetails);
                                  setDeletedDetails([
                                    ...deletedDetails,
                                    detail.id,
                                  ]);
                                }}
                              >
                                -
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="color"
                            id="color"
                            className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="Black"
                            onChange={(e) => setColor(e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            name="size"
                            id="size"
                            className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent px-2.5 my-1"
                            onChange={(e) => setSize(e.target.value)}
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
                            className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="0"
                            min="0" // Set minimum value to 0 to prevent negative values
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="stock"
                            id="stock"
                            className="input-sm w-full border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-accent p-2.5 my-1"
                            placeholder="0"
                            min="0" // Set minimum value to 0 to prevent negative values
                            onChange={(e) => setStock(e.target.value)}
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

                              setNewProductDetails((prevDetails) => [
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
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {productGalleries?.map((item, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`http://localhost:5000/${item.photo}`}
                        alt={`Product Image ${index + 1}`}
                        className="max-w-full h-auto"
                      />
                      <button
                        className="absolute top-2 right-2 p-1 text-white rounded-full bg-gradient-to-br from-red-400 to-error shadow-md shadow-gray-300 hover:scale-[1.02]"
                        onClick={() => {
                          const updatedProductGalleries = [...productGalleries];

                          updatedProductGalleries.splice(index, 1);

                          setProductGalleries(updatedProductGalleries);
                          setDeletedImages([...deletedImages, item.id]);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex flex-col w-full h-32 mt-2 rounded border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
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
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    key={imagePreview.length}
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple={imagePreview.length < 5}
                  />
                </label>
                <ImagePreview
                  imagePreview={imagePreview}
                  handleRemoveImage={handleRemoveImage}
                />
                {uploadError && (
                  <div className="bg-red-100 border border-error text-error text-sm px-3 py-2 rounded relative">
                    {uploadError}
                  </div>
                )}
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
