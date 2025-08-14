import { config, instance } from "@/utils/axiosConfig";

const calculateShippingFee = async (storeId, { distanceKm }) => {
  const response = await instance.get(`/shipping-fee/stores/${storeId}/calculate?distanceKm=${distanceKm}`, config());
  if (response.data) {
    return response.data;
  }
};

export const shippingFeeService = {
  calculateShippingFee,
};
