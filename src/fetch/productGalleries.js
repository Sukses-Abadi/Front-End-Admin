import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

const token = getCookie("adminAccessToken");

export const addProductImage = async (id, params) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/${id}/galleries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
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

export const deleteProductImage = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/galleries/${id}`, {
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
