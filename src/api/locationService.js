import { config, instance } from "../utils/axiosConfig";

const getLocation = async () => {
  const response = await instance.get(`/location/`, config());
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

const deleteLocation = async (id) => {
  const response = await instance.delete(`/location/delete-location/${id}`, config());
  if (response.data) {
    return response.data;
  }
};

export const locationService = {
  getLocation,
  getUserLocations,
  addLocation,
  deleteLocation,
};
