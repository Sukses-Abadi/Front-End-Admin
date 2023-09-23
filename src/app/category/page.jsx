import { getAllCategories } from "./components/fetch";
import Categories from "./components/Category";
import AddCategory from "./components/AddCategory";

export default async function Category() {
  const categories = await getAllCategories();
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-10">List Category</h1>
      <div className="m-16">
        <div>
          <AddCategory />
        </div>
        <table className="table table-zebra table-m">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Detail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.data.map((category, index) => (
              <>
                <Categories
                  key={category.id}
                  category={category}
                  index={index}
                />
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
