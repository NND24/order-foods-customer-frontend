import { config, instance } from "../utils/axiosConfig";

const getUserOrder = async () => {
  const response = await instance.get(`/order/`, config());
  if (response.data) {
    return response.data;
  }
};

const getOrderDetail = async (orderId) => {
  const response = await instance.get(`/order/${orderId}`, config());
  if (response.data) {
    return response.data;
  }
};

const cancelOrder = async (orderId) => {
  const response = await instance.put(`/order/${orderId}/cancel-order`, config());
  if (response.data) {
    return response.data;
  }
};

const reOrder = async (orderId) => {
  const response = await instance.post(`/order/re-order/${orderId}`, config());
  if (response.data) {
    return response.data;
  }
};

export const orderService = {
  getUserOrder,
  getOrderDetail,
  cancelOrder,
  reOrder,
};
