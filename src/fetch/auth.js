import BASE_URL from "@/lib/baseUrl";
import { setCookie } from "cookies-next";

export const login = async (params) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (response.status >= 400) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();

    data && setCookie("adminAccessToken", data);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const register = async (params) => {
  try {
    const response = await fetch(`${BASE_URL}/cms/register`, {
      method: "POST",
      headers: {
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
