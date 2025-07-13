import { config, instance } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const getCurrentUser = async (id) => {
  const response = await instance.post(`/user/${id}`, config);

  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
  const response = await instance.put(`/user/`, data, config);
  if (response.data) {
    return response.data;
  }
};

export const userService = {
  getCurrentUser,
  updateUser,
};
