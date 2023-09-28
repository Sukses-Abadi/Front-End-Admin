"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";
import { BankName, validateAccountNumber } from "./fetch";
import Swal from "sweetalert2";

export default function AddBankAccount() {
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const token = getCookie("adminAccessToken");

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingAccNum = await validateAccountNumber(token);
      if (existingAccNum.includes(accountNumber)) {
        return Swal.fire({
          icon: "error",
          title: "Create Bank Account Failed",
          text: "Account number already exist!",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      const payload = {
        account_holder: accountHolder,
        bank_name: bankName,
        account_number: accountNumber,
      };
      const responseData = await fetch(`${BASE_URL}/cms/bank-accounts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      // if (responseData.error === "Unauthorized" || response.status === 401) {
      //   alert("Authorization not valid, redicting to login page");
      //   deleteCookie("accessToken");
      //   router.push("/login")
      //   return;
      // }

      const response = await responseData.json();

      Swal.fire({
        icon: "success",
        title: "Create Bank Account Success",
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
        Add New Bank Account
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-5">Add New Bank Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">Account Holder</label>
              <input
                required
                type="text"
                className="input input-sm input-bordered sm:input-md"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
              <label className="label font-bold">Bank</label>
              <select
                className="select select-sm sm:select-md select-bordered"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              >
                <option disabled>Select Bank Name</option>
                {BankName.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <label className="label font-bold">Account Number</label>
              <input
                required
                type="text"
                className="input input-sm input-bordered sm:input-md"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
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
                className="btn btn-sm sm:btn-md btn-primary"
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
