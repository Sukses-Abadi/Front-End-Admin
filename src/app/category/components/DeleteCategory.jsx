"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { token } from "@/lib/token";
import Swal from "sweetalert2";

export default function DeleteCategory({ category }) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (categoryId) => {
    try {
      const responseData = await fetch(
        `${baseUrl}/api/cms/category/${categoryId}`,
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
        title: "Delete Category Success",
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
      <button className="btn btn-sm btn-error ml-3" onClick={handleModal}>
        Delete
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="text-xl font-bold">
            Are you sure delete {category.name} ?
          </h3>
          <form onSubmit={handleDelete}>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                No
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={() => handleDelete(category.id)}
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
