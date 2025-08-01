import { config, instance } from "@/utils/axiosConfig";

const createVNPayOrder = async (orderId) => {
  const response = await instance.get(
    `/payment/vnpay/qrcode/${orderId}`,
    config() // this should include Authorization header
  );

  if (response.data) {
    return response.data;
  }

  throw new Error("VNPay QR generation failed");
};

export const paymentService = {
  createVNPayOrder,
  // ... other methods like createVNPayOrder
};
