import { config, instance } from "../utils/axiosConfig";

const getAllNotifications = async () => {
  const response = await instance.get(`/notification/get-all-notifications`, config());
  if (response.data) {
    return response.data;
  }
};

const updateNotificationStatus = async (id) => {
  const response = await instance.put(`/notification/update-notification/${id}`, null, config());
  if (response.data) {
    return response.data;
  }
};

export const notificationService = {
  getAllNotifications,
  updateNotificationStatus,
};
