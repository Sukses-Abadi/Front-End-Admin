import Image from "next/image";
import React from "react";

export default function OrderTable({ data }) {
  return (
    <div className="border-2 rounded-lg p-10 h-fit bg-slate-50 ">
      <table className="  overflow-x-auto">
        <thead className=" font-sans text-left font-bold ">
          <tr className="h-16">
            <th key="item-summary" className=" min-w-[200px]  border-b-2 ">
              Items summary
            </th>
            <th key="qty" className=" border-b-2 ">
              QTY
            </th>
            <th key="price" className="px-4  border-b-2 ">
              Price
            </th>
            <th key="total_price" className=" border-b-2 ">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {data.orderProducts.map((product) => {
            const productDetails = product.ProductDetails;
            const price = product.price;
            const size = productDetails.size;
            const color = productDetails.color;
            const qty = product.quantity;
            const name = productDetails.product.name;
            const { photo } = productDetails.product.productGalleries[0];
            const photoUrl = `http://localhost:5000/${photo}`;
            return (
              <tr key={product.id}>
                <td className=" items-center  flex font-mono font-semibold py-8 border-b-2">
                  <Image
                    className="px-3"
                    src={photoUrl}
                    alt=""
                    width={100}
                    height={100}
                  ></Image>
                  <div className="text-sm">
                    <h1>{name}</h1>
                    <h1>Size: {size}</h1>
                    <h1>Color: {color}</h1>
                  </div>
                </td>
                <td className="text-center font-mono font-semibold py-8 border-b-2">
                  x{qty}
                </td>
                <td className="px-4 font-mono font-semibold py-8 border-b-2">
                  Rp. {price}
                </td>
                <td className="px-4 font-mono font-semibold py-8 border-b-2">
                  Rp. {price * qty}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
