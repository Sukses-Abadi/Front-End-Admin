// SHOULD BE DELETED LATER
import accessToken from "@/lib/token";

import BASE_URL from "@/lib/baseUrl";

export const getAllProducts = async (queryParams) => {
  // SHOULD BE DELETED LATER
  const token = accessToken;

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
