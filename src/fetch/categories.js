import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

const token = getCookie("adminAccessToken");

export const getAllCategory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/cms/category`, {
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

export const getOneCategory = async (id) => {
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
