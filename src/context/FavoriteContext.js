"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { favoriteService } from "@/api/favoriteService";

const favoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const refreshFavorite = async () => {
    try {
      if (userId) {
        setLoading(true);
        const response = await favoriteService.getUserFavorite();
        setFavorite(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorite();
  }, []);

  return <favoriteContext.Provider value={{ favorite, loading, refreshFavorite }}>{children}</favoriteContext.Provider>;
};

export const useFavorite = () => {
  const context = useContext(favoriteContext);
  if (!context) throw new Error("usefavorite phải dùng trong <favoriteProvider>");
  return context;
};
