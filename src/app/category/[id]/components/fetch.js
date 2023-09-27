import BASE_URL from "@/lib/baseUrl";

export const getAllSubCategories = async (token, categoryId) => {
  try {
    const res = await fetch(`${BASE_URL}/cms/subcategory`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const subCategoryData = await res.json();
    const subCategories = subCategoryData.data;
    const filteredSubCategories = subCategories.filter(
      (subcategory) => subcategory.category_id === +categoryId
    );
    return filteredSubCategories;
  } catch (error) {
    console.error("ERROR:", error);
  }
};

const subCategories = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/cms/subcategory`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const subcategory = await res.json();
    return subcategory;
  } catch (error) {
    console.error(error);
  }
};

export const validateName = async (token) => {
  try {
    const result = await subCategories(token);
    const allName = result.data.map((name) => name.name);
    return allName;
  } catch (error) {
    console.error(error);
  }
};
