"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "@/api/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const refreshCart = async () => {
    try {
      if (userId) {
        setLoading(true);
        const response = await cartService.getUserCart();
        setCart(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return <CartContext.Provider value={{ cart, loading, refreshCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải dùng trong <CartProvider>");
  return context;
};
