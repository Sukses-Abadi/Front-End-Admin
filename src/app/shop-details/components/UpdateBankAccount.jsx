"use client";
import { baseUrl } from "@/lib/baseUrl";
import { token } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateAccountNumber, BankName } from "./fetch";
import Swal from "sweetalert2";

export default function UpdateBankAccount({ bankAccount }) {
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
          title: "Update Bank Account Failed",
          text: "Account number already exist",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      const payload = {
        account_holder: accountHolder,
        bank_name: bankName,
        account_number: accountNumber,
      };
      const responseData = await fetch(
        `${baseUrl}/api/cms/bank-accounts/${bankAccount.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );
      const response = await responseData.json();
      Swal.fire({
        icon: "success",
        title: "Update Bank Account Success",
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
      <button className="btn btn-sm btn-primary" onClick={handleModal}>
        Edit
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-5">
            Update {bankAccount.accountHolder}
          </h3>
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
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btin-md"
                  onClick={handleModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-md btn-primary">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
