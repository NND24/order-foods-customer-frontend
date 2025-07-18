"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { orderService } from "@/api/orderService";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const refreshOrder = async () => {
    try {
      if (userId) {
        setLoading(true);
        const response = await orderService.getUserOrder();
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrder();
  }, []);

  return <OrderContext.Provider value={{ order, loading, refreshOrder }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder phải dùng trong <OrderProvider>");
  return context;
};
