import React from "react";

export default function DeliveryAddress({ data }) {
  const address = data.address;
  return (
    <div className="border-2 rounded-lg p-10 flex-1 min-w-[370px] bg-slate-50">
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-left ">Delivery Address </h1>
      </div>
      <div className="divider"></div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm  text-left ">Address Name</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {address.name}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm  text-left ">Address Street</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {address.street}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm  text-left ">City</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {address.city.name}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-sm  text-left ">Zip Code</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {address.zip_code}
        </span>
      </div>
    </div>
  );
}
