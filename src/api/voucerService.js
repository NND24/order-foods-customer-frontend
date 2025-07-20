import { config, instance } from "@/utils/axiosConfig";

const getVouchersByStore = async (storeId) => {
  const response = await instance.get(`/voucher/stores/${storeId}/vouchers`, config());
  if (response.data) {
    return response.data;
  }
};

const getVoucherById = async ({ storeId, id }) => {
  const response = await instance.get(`/voucher/stores/${storeId}/vouchers/${id}`, config());
  if (response.data) {
    return response.data;
  }
};

export const voucherService = {
  getVouchersByStore,
  getVoucherById,
};
