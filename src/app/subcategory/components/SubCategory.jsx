import DeleteSubCategory from "./DeleteSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";

const SubCategories = ({ subCategories, index, categories }) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{subCategories.name}</td>
      <td>{subCategories.category_id}</td>
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
