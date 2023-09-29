"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";
import Swal from "sweetalert2";

export default function DeleteSubCategory({ subCategories }) {
  const [isOpen, setIsOpen] = useState(false);
  const token = getCookie("adminAccessToken");
  const router = useRouter();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (subCategoriesId) => {
    try {
      const responseData = await fetch(
        `${BASE_URL}/cms/subcategory/${subCategoriesId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await responseData.json();

      Swal.fire({
        icon: "success",
        title: "Delete Sub-Category Success",
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
      <button
        className="btn btn-xs btn-outline sm:btn-sm btn-error ml-3"
        onClick={handleModal}
      >
        Delete
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="text-xl font-bold">
            Are you sure delete {subCategories.name} ?
          </h3>
          <form onSubmit={handleDelete}>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm sm:btn-md"
                onClick={handleModal}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-sm sm:btn-md btn-error"
                onClick={() => handleDelete(subCategories.id)}
              >
                Yes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
