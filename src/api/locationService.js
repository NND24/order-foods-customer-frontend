import { config, instance } from "@/utils/axiosConfig";

const getLocationDetail = async (id) => {
  const response = await instance.get(`/location/get-location/${id}`, config());
  if (response.data) {
    return response.data;
  }
};

const getUserLocations = async () => {
  const response = await instance.get(`/location/get-user-locations`, config());
  if (response.data) {
    return response.data;
  }
};

const addLocation = async (data) => {
  const response = await instance.post(`/location/add-location`, data, config());
  if (response.data) {
    return response.data;
  }
};

const updateLocation = async ({ id, data }) => {
  const response = await instance.put(`/location/update-location/${id}`, data, config());
  if (response.data) {
    return response.data;
  }
};

const deleteLocation = async (id) => {
  const response = await instance.delete(`/location/delete-location/${id}`, config());
  if (response.data) {
    return response.data;
  }
};

export const locationService = {
  getLocationDetail,
  getUserLocations,
  addLocation,
  updateLocation,
  deleteLocation,
};
