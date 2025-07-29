import { config, instance } from "@/utils/axiosConfig";

const createZaloPayOrder = async ({ storeId, amount, description }) => {
  const response = await instance.post(`/payment/zalopay`, { storeId, amount, description }, config());
  if (response.data) {
    return response.data;
  }
};

export const paymentService = {
  createZaloPayOrder,
};
