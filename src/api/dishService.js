import { config, instance } from "../utils/axiosConfig";

const getAllDish = async (storeId) => {
  const response = await instance.get(`/customer-store/${storeId}/dish`, config());
  if (response.data) {
    return response.data;
  }
};

const getDish = async (dishId) => {
  const response = await instance.get(`/customer-store/dish/${dishId}`, config());
  if (response.data) {
    return response.data;
  }
};

export const dishService = {
  getAllDish,
  getDish,
};
