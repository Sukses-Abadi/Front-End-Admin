import BankAccount from "./components/BankAccount";
import { getAllBankAccount } from "./components/fetch";
import AddBankAccount from "./components/AddBankAccount";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = cookies().get("adminAccessToken");
  const bankAccounts = await getAllBankAccount(token.value);

  if (bankAccounts.error === "Unauthorized") {
    redirect("/logout");
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4">
        <h1 className="text-4xl font-bold text-center mb-10">
          List Bank Account
        </h1>
        <div>
          <AddBankAccount />
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full table-sm sm:table-md">
            <thead>
              <tr>
                <th className="hidden sm:block">No</th>
                <th>Account Holder</th>
                <th>Bank</th>
                <th>Account Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankAccounts.data.map((bankAccount, index) => (
                <tr key={bankAccount.id}>
                  <BankAccount bankAccount={bankAccount} index={index} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
