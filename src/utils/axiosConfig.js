import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/v1",
});

const token = localStorage.getItem("token") ? localStorage.getItem("token").replace(/^"|"$/g, "") : null;
export const config = {
  headers: {
    Authorization: `Bearer ${token ? token : ""}`,
    Accept: "application/json",
  },
};
