"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useOrder } from "@/context/orderContext";
import OrderCard from "@/components/order/OrderCard";

const Page = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current"); // "current" | "history"

  const { order, loading } = useOrder();

  useEffect(() => {
    setCurrentOrders(order?.filter((o) => o.status !== "done"));
    setDoneOrders(order?.filter((o) => o.status === "done"));
  }, [order]);

  const renderOrders = (orders, isHistory) => {
    if (loading) {
      return <h3 className='text-[20px] text-[#4a4b4d] font-semibold'>Đang tải...</h3>;
    }
    if (!orders || orders.length === 0) {
      return <h3 className='text-[20px] text-[#4a4b4d] font-semibold'>Không có đơn hàng nào</h3>;
    }
    return orders.map((o) => <OrderCard key={o._id} order={o} history={isHistory} />);
  };

  return (
    <div className='pt-[10px] pb-[100px] md:pt-[90px] md:px-0'>
      <Heading title='Đơn hàng' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='orders' />
      </div>

      <MobileHeader />

      {/* Tabs */}
      <div className='px-[20px] md:w-[90%] md:mx-auto'>
        <div className='flex items-center justify-center mb-6 bg-gray-100 rounded-full p-1'>
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "current" ? "bg-[#fc6011] text-white shadow-md" : "text-gray-600 hover:text-[#fc6011]"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Hiện tại
          </button>
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "history" ? "bg-[#fc6011] text-white shadow-md" : "text-gray-600 hover:text-[#fc6011]"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "current" && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]'>
            {renderOrders(currentOrders, false)}
          </div>
        )}
        {activeTab === "history" && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]'>
            {renderOrders(doneOrders, true)}
          </div>
        )}
      </div>

      <div className='block md:hidden'>
        <NavBar page='orders' />
      </div>
    </div>
  );
};

export default Page;
