import BASE_URL from "@/lib/baseUrl";

export const getAllCategories = async (token) => {
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

export const validateName = async (token) => {
  try {
    const result = await getAllCategories(token);
    const allName = result.data.map((name) => name.name);
    return allName;
  } catch (error) {
    console.error;
  }
};
