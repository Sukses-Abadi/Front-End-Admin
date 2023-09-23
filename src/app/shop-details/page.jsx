import BankAccount from "./components/BankAccount";
import { getAllBankAccount } from "./components/fetch";
import AddBankAccount from "./components/AddBankAccount";

export default async function Page() {
  const bankAccounts = await getAllBankAccount();
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-10">
        List Bank Account
      </h1>
      <div className="m-16">
        <div>
          <AddBankAccount />
        </div>
        <table className="table table-zebra table-m">
          <thead>
            <tr>
              <th>No</th>
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
    </>
  );
}
