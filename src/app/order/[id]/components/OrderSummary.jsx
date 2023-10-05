import React from "react";

export default function OrderSummary({ data }) {
  const timestamp = data.order_date;
  const dateObject = new Date(timestamp);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = dateObject.toLocaleDateString("en-US", options);
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;

  return (
    <div className="border-2 rounded-lg p-10 flex-1 min-w-[370px] bg-slate-50">
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-left ">Order Summary </h1>
        <span
          className="ml-10 font-semibold text-sm text-gray-700 text-right border-2 bg-gray-100 px-2 py-1 rounded-md"
          style={{
            backgroundColor:
              data.status === "waiting"
                ? "#8DD1F0"
                : data.status === "received"
                ? "#E0C7FE"
                : data.status === "rejected"
                ? "#F6AA97"
                : data.status === "shipped"
                ? "#F7D0AF"
                : data.status === "complete"
                ? "#93EF93"
                : "Red",
          }}
        >
          {data.status === "waiting" ? "Waiting for payment" : null}
          {data.status === "received" ? "Payment is received" : null}
          {data.status === "shipped" ? "Items is being shipped" : null}
          {data.status === "complete" ? "Item has arrived" : null}
          {data.status === "rejected" ? "Payment is being rejected" : null}
        </span>
      </div>
      <div className="divider"></div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm  text-left ">Order Created</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {formattedDate}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm text-left ">Order Time</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {formattedTime}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm text-left ">Sub Total</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          Rp. {data.total_price}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm text-left ">Delivery fee</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          Rp. {data.shipping_cost}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold  text-left ">Total Payment</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          Rp. {data.total_payment}
        </span>
      </div>
    </div>
  );
}
