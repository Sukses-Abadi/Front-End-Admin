import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

const token = getCookie("adminAccessToken");

export const getAllReviews = async (queryParams) => {
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([ind, value]) => value !== null)
  );
  const queryString = new URLSearchParams(filteredQueryParams).toString();

  try {
    const response = await fetch(`${BASE_URL}/review?${queryString}`, {
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

export const deleteReview = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 400) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
