"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { cartService } from "@/api/cartService";

const DishBigCard = ({ dish, storeInfo, cartItems }) => {
  const router = useRouter();

  const [cartItem, setCartItem] = useState(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { refreshCart } = useCart();

  useEffect(() => {
    if (cartItems) {
      setCartItem(cartItems.find((item) => item?.dish?._id === dish?._id));
    }
  }, [cartItems]);

  const handleChangeQuantity = async (amount) => {
    if (storeInfo?.data?.openStatus === "CLOSED") {
      toast.warn("Món ăn đã hết hàng. Vui lòng chọn món khác.");
      return;
    }

    if (currentUser) {
      if (dish.toppingGroups.length > 0) {
        router.push(`/store/${storeInfo?.data?._id}/dish/${dish._id}`);
      } else {
        try {
          const currentQuantity = cartItem?.quantity || 0;
          const newQuantity = Math.max(currentQuantity + amount, 0);

          cartService.updateCart({ storeId: storeInfo?.data?._id, dishId: dish._id, quantity: newQuantity });

          refreshCart();
          toast.success("Cập nhật giỏ hàng thành công");
        } catch (error) {
          toast.error(error?.data?.message || "Có lỗi xảy ra!");
        }
      }
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
    }
  };

  return (
    <div className='relative'>
      {storeInfo?.data?.openStatus === "CLOSED" ? (
        <div className='absolute inset-0 bg-[#00000080] z-20 flex items-center justify-center rounded-[8px] cursor-not-allowed'>
          <span className='text-white text-[16px] font-semibold'>Cửa hàng hiện đang đóng</span>
        </div>
      ) : dish?.stockStatus === "OUT_OF_STOCK" ? (
        <div className='absolute inset-0 bg-[#00000080] z-20 flex items-center justify-center rounded-[8px] cursor-not-allowed'>
          <span className='text-white text-[16px] text-center font-semibold'>
            Món ăn hiện không còn được phục vụ. Vui lòng chọn món khác.
          </span>
        </div>
      ) : null}

      <Link
        href={`/store/${dish.store}/dish/${dish._id}`}
        className={`${storeInfo?.data?.openStatus === "CLOSED" ? "pointer-events-none" : ""}`}
      >
        <div className='relative flex flex-col gap-[4px] pt-[75%] w-full' name='bigDishCard'>
          <Image
            src={dish?.image?.url}
            alt=''
            layout='fill'
            objectFit='cover'
            className='rounded-[15px] justify-center'
          />

          {cartItem?.quantity > 0 ? (
            <div className='absolute bottom-[10%] right-[5%] flex items-center justify-center bg-[#fff] gap-[4px] border border-[#fc6011] border-solid rounded-full px-[8px] py-[4px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] z-10'>
              <Image
                src='/assets/minus.png'
                alt=''
                width={20}
                height={20}
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeQuantity(-1);
                }}
                className=''
              />
              <input
                type='number'
                value={cartItem?.quantity}
                onClick={(e) => {
                  e.preventDefault();
                }}
                readOnly
                name=''
                id=''
                className='text-[#4A4B4D] text-[20px] font-bold w-[40px] text-center bg-transparent'
              />
              <Image
                src='/assets/plus_active.png'
                alt=''
                width={20}
                height={20}
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeQuantity(1);
                }}
                className=''
              />
            </div>
          ) : (
            <Image
              src='/assets/add_active.png'
              name='addingCart'
              alt=''
              width={40}
              height={40}
              className='absolute bottom-[10%] right-[5%] bg-[#fff] rounded-full shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'
              onClick={(e) => {
                e.preventDefault();
                handleChangeQuantity(1);
              }}
            />
          )}
        </div>

        <div>
          <h4 className='text-[#4A4B4D] text-[20px] font-medium pt-[2px] line-clamp-1' name='dishName'>
            {dish?.name}
          </h4>
          {dish?.description && <p className='text-[#a4a5a8] text-[14px] line-clamp-1'>{dish?.description}</p>}
          <p className='text-[#000] font-bold' name='dishPrice'>
            {Number(dish?.price).toLocaleString("vi-VN")}đ
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DishBigCard;
