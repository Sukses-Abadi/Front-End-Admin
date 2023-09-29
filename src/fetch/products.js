import BASE_URL from "@/lib/baseUrl";
import { getCookie } from "cookies-next";

const token = getCookie("accessToken");

export const getAllProducts = async (queryParams) => {
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

export const getSingleProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/${id}`, {
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

export const createProduct = async (params) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products`, {
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

export const updateProduct = async (id, params) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/${id}`, {
      method: "PUT",
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

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/products/${id}`, {
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
