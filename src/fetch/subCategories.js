import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

export const getOneSubCategory = async (id) => {
  const token = getCookie("adminAccessToken");

  try {
    const response = await fetch(`${BASE_URL}/cms/subcategory/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
