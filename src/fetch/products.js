import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

export const getAllProducts = async (queryParams) => {
  const token = getCookie("accessToken");

  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([ind, value]) => value !== null)
  );
  const queryString = new URLSearchParams(filteredQueryParams).toString();

  try {
    const response = await fetch(`${BASE_URL}/cms/products?${queryString}`, {
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
