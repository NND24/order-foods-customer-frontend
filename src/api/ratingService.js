import { config, instance } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const getAllStoreRating = async ({ storeId, sort, limit, page }) => {
  const response = await instance.get(`/rating/${storeId}`, { sort, limit, page }, config);
  if (response.data) {
    return response.data;
  }
};

const getDetailRating = async (ratingId) => {
  const response = await instance.get(`/rating/detail/${ratingId}`, config);
  if (response.data) {
    return response.data;
  }
};

const addStoreRating = async ({ storeId, data }) => {
  const response = await instance.post(`/rating/${storeId}`, data, config);
  if (response.data) {
    return response.data;
  }
};

const editStoreRating = async ({ ratingId, data }) => {
  const response = await instance.put(`/rating/${ratingId}`, data, config);
  if (response.data) {
    return response.data;
  }
};

const deleteStoreRating = async (ratingId) => {
  const response = await instance.delete(`/rating/${ratingId}`, config);
  if (response.data) {
    return response.data;
  }
};

export const ratingService = {
  getAllStoreRating,
  getDetailRating,
  addStoreRating,
  editStoreRating,
  deleteStoreRating,
};
