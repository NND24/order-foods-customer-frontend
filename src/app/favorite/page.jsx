"use client";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useFavorite } from "@/context/favoriteContext";
import { favoriteService } from "@/api/favoriteService";
import FavoriteItem from "@/components/favorite/FavoriteItem";

const page = () => {
  const { favorite, loading, refreshFavorite } = useFavorite();

  const handleRemoveAllFavorite = async () => {
    try {
      await favoriteService.removeAllFavorite();
      toast.success("Xóa hết yêu thích thành công!");

      refreshFavorite();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemoveAllFavorite = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa hết yêu thích?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleRemoveAllFavorite();
    }
  };

  return (
    <div className='pt-[10px] pb-[100px] md:pt-[90px] md:px-0'>
      <Heading title='Yêu thích' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='favorite' />
      </div>

      <MobileHeader page='favorite' />

      <div className='md:w-[90%] md:mx-auto px-[20px]'>
        {!loading ? (
          <>
            {favorite ? (
              <div className='my-[20px]'>
                <div className='flex items-center justify-between mb-[20px]'>
                  <h3 className='text-[#4A4B4D] text-[24px] font-bold hidden md:block'>Các cửa hàng yêu thích</h3>
                  <div
                    className='flex items-center justify-center gap-[10px] p-[8px] rounded-[6px] bg-[#fc6011] cursor-pointer ml-auto md:ml-0 shadow-md hover:shadow-lg'
                    onClick={confirmRemoveAllFavorite}
                  >
                    <div className='relative w-[30px] pt-[30px] md:w-[24px] md:pt-[24px]'>
                      <Image src='/assets/trash_white.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                    <span className='text-white font-semibold text-[18px]'>Xóa hết yêu thích</span>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]'>
                  {favorite.store.map((store) => (
                    <FavoriteItem key={store._id} store={store} />
                  ))}
                </div>
              </div>
            ) : (
              <h3 className='text-[#4A4B4D] text-[24px] font-bold my-[10px]'>Yêu thích trống</h3>
            )}
          </>
        ) : (
          <h3 className='text-[#4A4B4D] text-[24px] font-bold my-[10px]'>Đang tải...</h3>
        )}
      </div>

      <div className='md:hidden'>
        <NavBar page='favorite' />
      </div>
    </div>
  );
};

export default page;
