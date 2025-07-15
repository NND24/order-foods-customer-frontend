import { config, instance } from "../utils/axiosConfig";

const getAllSystemCategory = async () => {
  const response = await instance.get(`/system-category/`);
  if (response.data) return response.data;
  return [];
};

export const systemCategoryService = {
  getAllSystemCategory,
};
