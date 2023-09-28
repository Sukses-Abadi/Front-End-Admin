import BASE_URL from "@/lib/baseUrl";

export const getAllBankAccount = async (token) => {
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

export const validateAccountNumber = async (token) => {
  try {
    const result = await getAllBankAccount(token);
    const accountNumber = result.data.map((accNum) => accNum.account_number);
    return accountNumber;
  } catch (error) {
    console.error(error);
  }
};
