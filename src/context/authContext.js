"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/api/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const res = await userService.getCurrentUser(id);
      setUser(res);
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) {
      const parsedId = JSON.parse(savedId);
      setUserId(parsedId);
      fetchUser(parsedId);
    } else {
      setLoading(false);
    }

    const handleStorageChange = () => {
      const id = localStorage.getItem("userId");
      setUserId(id);
      if (id) {
        fetchUser(id);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return <AuthContext.Provider value={{ userId, setUserId, user, setUser, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
