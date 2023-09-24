import BASE_URL from "@/lib/baseUrl";
import { token } from "@/lib/token";

export const getAllBankAccount = async () => {
  try {
    const res = await fetch(`${BASE_URL}/cms/bank-accounts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const bankAccount = await res.json();
    return bankAccount;
  } catch (error) {
    console.log(error);
  }
};

export const BankName = [
  "BSI",
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
  "Permata",
  "SeaBank",
];

export const validateAccountNumber = async () => {
  try {
    const result = await getAllBankAccount();
    const accountNumber = result.data.map((accNum) => accNum.account_number);
    return accountNumber;
  } catch (error) {
    console.error(error);
  }
};
