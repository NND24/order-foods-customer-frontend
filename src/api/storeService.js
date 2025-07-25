import { config, instance } from "../utils/axiosConfig";

const getAllStore = async ({ name, category, sort, limit, page, lat, lon }) => {
  const response = await instance.get(`/customer-store/`, {
    params: { name, category, sort, limit, page, lat, lon },
  });

  if (response.data) {
    return response.data;
  }
};

const getStoreInformation = async (id) => {
  const response = await instance.get(`/customer-store/${id}`);
  if (response.data) {
    return response.data;
  }
};

export const storeService = {
  getAllStore,
  getStoreInformation,
};
