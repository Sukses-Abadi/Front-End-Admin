import BASE_URL from "@/lib/baseUrl";
import { token } from "@/lib/token";

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/cms/category`, {
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
    const result = await getAllCategories();
    const allName = result.data.map((name) => name.name);
    return allName;
  } catch (error) {
    console.error;
  }
};
