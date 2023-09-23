"use client";
import { useState } from "react";

export default function Details({ category }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const categoryId =
    category && category.SubCategory.length > 0
      ? category.SubCategory[0].category_id
      : null;

  return (
    <div>
      <button className="btn btn-sm btn-info" onClick={handleModal}>
        Show
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box p-10">
          <h3 className="ml-3 text-3xl mb-8 font-bold ">
            Sub Category {category.name}
          </h3>
          <p className="ml-3 font-thin -mt-8 mb-8">category_id {categoryId}</p>
          {isOpen && category ? (
            <>
              <div className="overflow-x-auto">
                <table className="table table-l text-left">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.SubCategory.map((subCategory, index) => (
                      <tr key={subCategory.id}>
                        <td>{index + 1}</td>
                        <td>{subCategory.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-md float-right mt-5"
            onClick={handleModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
