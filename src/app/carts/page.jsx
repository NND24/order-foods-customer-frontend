"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import CartItem from "@/components/cart/CartItem";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/cartContext";

const page = () => {
  const { cart, loading, refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      refreshCart();
      toast.success("Xóa hết giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const confirmClearCart = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa hết giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleClearCart();
    }
  };

  return (
    <div className='pt-[10px] pb-[100px] md:pt-[90px] md:px-0'>
      <Heading title='Giỏ hàng' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='carts' />
      </div>

      <MobileHeader page='carts' />

      <div className='md:w-[90%] md:mx-auto px-[20px]'>
        {!loading ? (
          <>
            {cart ? (
              <div className='my-[20px]'>
                <div className='flex items-center justify-between mb-[20px]'>
                  <h3 className='text-[#4A4B4D] text-[24px] font-bold hidden md:block'>Các cửa hàng đang đặt món</h3>
                  <div
                    className='flex items-center justify-center gap-[10px] p-[8px] rounded-[6px] bg-[#fc6011] cursor-pointer ml-auto md:ml-0 shadow-md hover:shadow-lg'
                    onClick={confirmClearCart}
                  >
                    <div className='relative w-[30px] pt-[30px] md:w-[24px] md:pt-[24px]'>
                      <Image src='/assets/trash_white.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                    <span className='text-white font-semibold text-[18px]'>Xóa hết giỏ hàng</span>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]'>
                  {cart?.map((cartItem) => (
                    <CartItem key={cartItem._id} cartItem={cartItem} />
                  ))}
                </div>
              </div>
            ) : (
              <h3 className='text-[#4A4B4D] text-[24px] font-bold my-[10px]'>Giỏ hàng trống</h3>
            )}
          </>
        ) : (
          <h3 className='text-[#4A4B4D] text-[24px] font-bold my-[10px]'>Đang tải...</h3>
        )}
      </div>

      <div className='block md:hidden'>
        <NavBar page='carts' />
      </div>
    </div>
  );
};

export default page;
