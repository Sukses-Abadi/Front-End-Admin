import BASE_URL from "@/lib/baseUrl";

export const uploadFiles = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/uploads`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
