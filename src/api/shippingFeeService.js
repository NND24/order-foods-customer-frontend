import { config, instance } from "@/utils/axiosConfig";

const calculateShippingFee = async (storeId, data) => {
  const response = await instance.get(`/shipping-fee/stores/${storeId}/calculate`, data, config());
  if (response.data) {
    return response.data;
  }
};

export const shippingFeeService = {
  calculateShippingFee,
};
