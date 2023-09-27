import DeleteBankAccount from "./DeleteBankAccount";
import UpdateBankAccount from "./UpdateBankAccount";

const BankAccount = ({ bankAccount, index }) => {
  return (
    <>
      <td className="hidden sm:block">{index + 1} </td>
      <td>{bankAccount.account_holder} </td>
      <td>{bankAccount.bank_name} </td>
      <td>{bankAccount.account_number} </td>
      <td className="flex">
        <UpdateBankAccount bankAccount={bankAccount} />
        <DeleteBankAccount bankAccount={bankAccount} />
      </td>
    </>
  );
};

export default BankAccount;
