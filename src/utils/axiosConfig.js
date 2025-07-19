import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/v1",
});

export const config = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
      Accept: "application/json",
    },
  };
};
