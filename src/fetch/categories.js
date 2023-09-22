// SHOULD BE DELETED LATER
import accessToken from "@/lib/token";

import BASE_URL from "@/lib/baseUrl";

export const getOneCategory = async (id) => {
  // SHOULD BE DELETED LATER
  const token = accessToken;

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
