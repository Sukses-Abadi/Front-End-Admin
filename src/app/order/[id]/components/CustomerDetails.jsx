import React from "react";

export default function CustomerDetails({ data }) {
  const user = data.user;
  return (
    <div className="border-2 rounded-lg overflow-x-auto h-fit my-4 p-10 bg-slate-50">
      {/* Headers */}
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-xl text-left py-8 border-b-2 flex-1">
          Customer And Shipment Details
        </h1>
      </div>
      <div className="flex justify-between items-center  py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Customer Name</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {user.first_name + " " + user.last_name}
        </span>
      </div>
      <div className="flex justify-between items-center py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Phone number</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {user.phone || "-"}
        </span>
      </div>
      <div className="flex justify-between items-center  py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Email</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {user.email || "-"}
        </span>
      </div>
      <div className="flex justify-between items-center  py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Courier</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {data.courier || "-"}
        </span>
      </div>
      <div className="flex justify-between items-center  py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Shipping Method</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {data.shipping_method || "-"}
        </span>
      </div>
      <div className="flex justify-between items-center  py-5 border-b-2">
        <h1 className=" font-bold text-sm text-left ">Transfer Method</h1>
        <span className="ml-10 font-semibold text-sm text-left">
          {" "}
          {data.bankAccount.account_holder +
            " " +
            data.bankAccount.account_number +
            " " +
            data.bankAccount.bank_name || "-"}
        </span>
      </div>
    </div>
  );
}
