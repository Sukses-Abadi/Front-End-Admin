import DeleteSubCategory from "./DeleteSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";

const SubCategories = ({ subCategories, index, categories }) => {
  return (
    <tr key={index}>
      <td className="hidden sm:block">{index + 1}</td>
      <td>{subCategories.name}</td>
      <td className="flex">
        <UpdateSubCategory
          subCategories={subCategories}
          categories={categories}
        />
        <DeleteSubCategory subCategories={subCategories} />
      </td>
    </tr>
  );
};

export default SubCategories;
