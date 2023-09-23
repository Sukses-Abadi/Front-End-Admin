"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { token } from "@/lib/token";
import Swal from "sweetalert2";
import { validateName } from "./fetch";

export default function UpdateSubCategory({ subCategories, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existName = await validateName();
      if (existName.includes(name)) {
        return Swal.fire({
          icon: "error",
          title: "Update Sub-Category Failed",
          text: "Name already exist",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      let payload = { name, category_id: categoryId };
      const responseData = await fetch(
        `${baseUrl}/api/cms/subcategory/${subCategories.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );
      const response = await responseData.json();

      Swal.fire({
        icon: "success",
        title: "Update Sub-Category Success",
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
    <div>
      <button className="btn btn-sm btn-primary" onClick={handleModal}>
        Edit
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box max-w-md">
          <h3 className="text-xl font-bold mb-5">
            Update {subCategories.name}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">Name</label>
              <input
                type="text"
                required
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="label font-bold">category_id</label>
              <select
                className="select select-bordered"
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
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-md"
                  onClick={handleModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-md btn-primary">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
