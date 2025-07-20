import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/cartContext";

const CartItem = ({ cartItem }) => {
  const [quantity, setQuantity] = useState(0);
  const { refreshCart } = useCart();

  useEffect(() => {
    const totalQuantity = cartItem.items.reduce((sum, item) => sum + item.quantity, 0);
    setQuantity(totalQuantity);
  }, [cartItem.items]);

  const handleClearCartItem = async () => {
    try {
      await cartService.clearCartItem(cartItem.store._id);
      refreshCart();
      toast.success("Xóa khỏi giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const confirmClearCartItem = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleClearCartItem();
    }
  };

  return (
    <Link
      href={`/store/${cartItem.store._id}`}
      className='relative block bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 overflow-hidden'
    >
      {/* Ảnh cửa hàng */}
      <div className='relative w-full pt-[55%]'>
        <Image
          src={cartItem.store.avatar.url || "/placeholder.png"}
          alt={cartItem.store.name}
          fill
          className='object-cover rounded-t-2xl'
        />
      </div>

      {/* Nội dung */}
      <div className='p-4'>
        <div className='flex items-center justify-between gap-2'>
          <h4 className='text-gray-800 text-lg font-semibold line-clamp-1 flex-1'>{cartItem.store.name}</h4>
          <p className='text-gray-700 font-medium text-sm'>{quantity} món</p>
        </div>

        {/* Danh mục */}
        <div className='flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 truncate'>
          {cartItem.store.storeCategory.map((category, index) => (
            <Link
              href={`/search?category=${category._id}`}
              key={category._id}
              className='hover:underline hover:text-orange-500 flex items-center gap-1'
            >
              {category.name}
              {index !== cartItem.store.storeCategory.length - 1 && <span className='text-orange-500'>•</span>}
            </Link>
          ))}
        </div>

        {/* Rating */}
        <div className='flex items-center gap-2 mt-2'>
          {cartItem.store.avgRating > 0 && (
            <>
              <div className='relative w-4 h-4'>
                <Image src='/assets/star_active.png' alt='rating' fill className='object-contain' />
              </div>
              <span className='text-orange-500 text-sm font-medium'>{cartItem.store.avgRating.toFixed(1)}</span>
            </>
          )}
          {cartItem.store.amountRating > 0 && (
            <span className='text-gray-500 text-sm'>({cartItem.store.amountRating} đánh giá)</span>
          )}
        </div>
      </div>

      {/* Nút xóa */}
      <div
        className='absolute top-3 right-3 z-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer transition'
        onClick={(e) => {
          e.preventDefault();
          confirmClearCartItem();
        }}
      >
        <div className='relative w-6 h-6'>
          <Image src='/assets/trash.png' alt='remove' fill className='object-contain' />
        </div>
      </div>
    </Link>
  );
};

export default CartItem;
