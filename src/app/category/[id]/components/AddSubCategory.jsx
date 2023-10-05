"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";
import Swal from "sweetalert2";
import { validateName } from "./fetch";

export default function AddSubCategory({ categories }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories.data[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = getCookie("adminAccessToken");

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existName = await validateName(token);
      if (existName.includes(name)) {
        return Swal.fire({
          icon: "error",
          title: "Create Sub-Category Failed",
          text: "Name already exist",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      const payload = {
        name: name,
        category_id: +categoryId,
      };

      const responseData = await fetch(`${BASE_URL}/cms/subcategory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const response = await responseData.json();

      Swal.fire({
        icon: "success",
        title: "Create Sub-Category Success",
        text: response.message,
        showConfirmButton: false,
        timer: 1500,
      });

      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center sm:justify-end">
      <button
        className="btn btn-sm btn-outline btn-primary mb-5 sm:btn-md"
        onClick={handleModal}
      >
        Add New Sub-Category
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box max-w-md">
          <h3 className="text-xl font-bold mb-5">Add New Sub-Category</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">Name</label>
              <input
                type="text"
                className="input input-sm input-bordered sm:input-md"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="label font-bold">Category</label>
              <select
                className="select select-sm sm:select-md select-bordered"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option disabled>Select Category</option>
                {categories.data.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm sm:btn-md"
                onClick={handleModal}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-sm sm:btn-md btn-primary btn-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
