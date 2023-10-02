"use client";
import fetchWithTokenClient from "@/lib/fetchWithTokenClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function TransferReceipt({ data }) {
  const router = useRouter();
  const [tracking_number, setTrackingNumber] = useState("");

  const handleAccept = async (event) => {
    event.preventDefault();
    if (!tracking_number) {
      Swal.fire({ text: "Please enter tracking number" });
      return;
    }
    const body = {
      tracking_number,
      status: "shipped",
    };

    const res = await fetchWithTokenClient(`cms/order/${data.id}`, "PUT", {
      body: JSON.stringify(body),
    });
    if (res.status === "success") {
      Swal.fire({ icon: "success", text: "Success" });
      router.refresh();
    }
  };

  const handleReject = async (event) => {
    const body = {
      status: "rejected",
    };

    const res = await fetchWithTokenClient(`cms/order/${data.id}`, "PUT", {
      body: JSON.stringify(body),
    });
    if (res.status === "success") {
      Swal.fire({ icon: "success", text: "Rejected" });
      router.refresh();
    }
  };

  return (
    <div className="border-2 rounded-lg p-10 flex-1 min-w-[370px] bg-slate-50">
      {" "}
      <div className="flex justify-between items-center py-2">
        <h1 className=" font-bold text-xl text-left py-8 border-b-2 flex-1">
          Transfer Receipt
        </h1>
      </div>
      <div>
        {data.payment_receipt ? (
          <div className="flex items-center justify-center">
            <Image
              className="w-auto h-auto"
              onClick={() =>
                router.push(`http://localhost:5000/${data.payment_receipt}`)
              }
              src={`http://localhost:5000/${data.payment_receipt}`}
              alt={data.payment_receipt}
              height={200}
              width={200}
            />
          </div>
        ) : (
          "No payment receipt is submitted"
        )}
        {data.payment_receipt && data.status === "received" ? (
          <div className="flex p-5 items-center justify-center">
            <button
              className="bg-green-300 py-1 px-2 rounded-md mr-10"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Accept
            </button>
            <button
              onClick={() => handleReject()}
              className="bg-red-300 py-1 px-2 rounded-md"
            >
              {" "}
              Reject{" "}
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box p-10">
                <h3 className="font-bold text-lg">Add Tracking Number!</h3>
                <input
                  className="border my-8 text-sm p-2 mx-3"
                  name="tracking_number"
                  placeholder="Tracking Number Here"
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 hover:bg-slate-400 bg-slate-100 rounded-md "
                  onClick={(e) => handleAccept(e)}
                >
                  Submit
                </button>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        ) : null}
      </div>
    </div>
  );
}
