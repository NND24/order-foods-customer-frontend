import { config, instance } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const getAllFoodTypes = async () => {
  const response = await instance.get(`/foodType/`);
  if (response.data) {
    return response.data;
  }
};

export const foodTypeService = {
  getAllFoodTypes,
};
