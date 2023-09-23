import { getAllSubCategories } from "./components/fetch";
import { getAllCategories } from "../category/components/fetch";
import SubCategories from "./components/SubCategory";
import AddSubCategory from "./components/AddSubCategory";

export default async function SubCategory() {
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-10">
        List Sub-Category
      </h1>
      <div className="m-16">
        <div>
          <AddSubCategory categories={categories} />
        </div>
        <table className="table table-zebra table-m">
          <thead>
            <tr className="text">
              <th>No</th>
              <th>Name</th>
              <th>Category Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.data.map((subCategory, index) => (
              <>
                <SubCategories
                  key={subCategory.id}
                  subCategories={subCategory}
                  index={index}
                  categories={categories}
                />
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
