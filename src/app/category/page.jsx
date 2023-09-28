import { getAllCategories } from "./components/fetch";
import Categories from "./components/Category";
import AddCategory from "./components/AddCategory";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";

export default async function Category() {
  const token = cookies().get("adminAccessToken");
  const categories = await getAllCategories(token.value);
  if (categories.error === "Unauthorized") {
    redirect("/logout");
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4">
        <h1 className="text-4xl font-bold text-center mb-10">List Category</h1>
        <div>
          <AddCategory />
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full table-sm sm:table-lg">
            <thead>
              <tr>
                <th className="hidden sm:block">No</th>
                <th>Name</th>
                <th>Detail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.data.map((category, index) => (
                <Categories
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
