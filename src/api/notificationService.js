import { config, instance } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const getAllNotifications = async () => {
  const response = await instance.get(`/notification/get-all-notifications`, config);
  if (response.data) {
    return response.data;
  }
};

const updateNotificationStatus = async (id) => {
  const response = await instance.get(`/notification/update-notification/${id}`, config);
  if (response.data) {
    return response.data;
  }
};

export const notificationService = {
  getAllNotifications,
  updateNotificationStatus,
};
