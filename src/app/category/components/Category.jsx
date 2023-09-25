
import DeleteCategory from "./DeleteCategory";
import Details from "./Details";
import UpdateCategory from "./UpdateCategory";
const Category = ({ category, index }) => {
  return (
    <tr key={category.id}>
      <td>{index + 1}</td>
      <td>{category.name}</td>
      <td>
        <Details category={category} />
      </td>
      <td className="flex">
        <UpdateCategory category={category} />
        <DeleteCategory category={category} />
      </td>
    </tr>
  );
};

export default Category;
