import { cookies } from "next/headers";
import { getAllSubCategories } from "./components/fetch";
import { getAllCategories } from "../components/fetch";
import SubCategories from "./components/SubCategories";
import AddSubCategory from "./components/AddSubCategory";
import { redirect } from "next/navigation";

export default async function SubCategory({ params }) {
  const token = cookies().get("accessToken");
  const categoryId = params.id;
  const subCategories = await getAllSubCategories(token.value, categoryId);
  const categories = await getAllCategories(token.value);
  if (subCategories.error && categories.error === "Unauthorized") {
    redirect("/logout");
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4">
        <h1 className="text-4xl font-bold text-center">List Sub-Category</h1>
        <p className="ml-3 font-thin text-center mb-8">
          category_id {categoryId}
        </p>
        <div>
          <AddSubCategory categories={categories} />
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full table-sm sm:table-md">
            <thead>
              <tr>
                <th className="hidden sm:block">No</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subcategory, index) => (
                <>
                  <SubCategories
                    key={subcategory.id}
                    subCategories={subcategory}
                    categories={categories}
                    index={index}
                  />
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
