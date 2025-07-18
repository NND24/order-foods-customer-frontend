"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000" || "";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);

    // Đăng ký userId với server
    newSocket.emit("registerUser", userId);

    // Nhận danh sách thông báo cũ khi kết nối
    newSocket.on("getAllNotifications", (allNotifications) => {
      setNotifications(allNotifications);
    });

    // Nhận thông báo mới
    newSocket.on("newNotification", (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
