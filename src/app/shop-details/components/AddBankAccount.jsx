"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { token } from "@/lib/token";
import { BankName, validateAccountNumber } from "./fetch";
import Swal from "sweetalert2";

export default function AddBankAccount() {
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingAccNum = await validateAccountNumber();
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
      const responseData = await fetch(`${baseUrl}/api/cms/bank-accounts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
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
    <div>
      <button
        className="btn btn-md btn-primary float-right mb-5 "
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
                className="input input-bordered"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
              <label className="label font-bold">Bank</label>
              <select
                className="select select-bordered"
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
                className="input input-bordered"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}