import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

export const getOneCategory = async (id) => {
  const token = getCookie("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/cms/category/${id}`, {
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
