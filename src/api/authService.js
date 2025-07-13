import { config, instance } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const register = async (userData) => {
  const response = await instance.post(`/auth/register`, userData);
  if (response.data) {
    return response.data;
  }
};

const login = async (userData) => {
  const response = await instance.post("/auth/login", userData);

  if (response.data) {
    localStorage.setItem("userId", JSON.stringify(response.data._id));
    localStorage.setItem("token", JSON.stringify(response.data.token));
    return response.data;
  }
};

const loginWithGoogle = async (userData) => {
  const response = await instance.post("/auth/login/google", userData);

  if (response.data) {
    localStorage.setItem("userId", JSON.stringify(response.data._id));
    localStorage.setItem("token", JSON.stringify(response.data.token));
    return response.data;
  }
};

const logout = async () => {
  const response = await instance.get(`/auth/logout`);
  if (response.data) {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    return response.data;
  }
};

const refreshAccessToken = async () => {
  const response = await instance.get(`/auth/refresh`);
  if (response.data) {
    return response.data;
  }
};

const forgotPassword = async (data) => {
  const response = await instance.post(`/auth/forgot-password`, data);
  if (response.data) {
    return response.data;
  }
};

const checkOTP = async (data) => {
  const response = await instance.post(`/auth/check-otp`, data);
  if (response.data) {
    return response.data;
  }
};

const changePassword = async (data) => {
  const response = await instance.put(`/auth/change-password`, data);
  if (response.data) {
    return response.data;
  }
};

const resetPassword = async (data) => {
  const response = await instance.put(`/auth/reset-password`, data, config);
  if (response.data) {
    return response.data;
  }
};

export const authService = {
  register,
  login,
  loginWithGoogle,
  logout,
  refreshAccessToken,
  forgotPassword,
  checkOTP,
  changePassword,
  resetPassword,
};
