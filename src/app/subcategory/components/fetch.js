import { baseUrl } from "@/lib/baseUrl";
import { token } from "@/lib/token";

export const getAllSubCategories = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/cms/subcategory`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const category = await res.json();
    return category;
  } catch (error) {
    console.error(error);
  }
};

export const validateName = async () => {
  try {
    const result = await getAllSubCategories();
    const allName = result.data.map((name) => name.name);
    return allName;
  } catch (error) {
    console.error(error);
  }
};
