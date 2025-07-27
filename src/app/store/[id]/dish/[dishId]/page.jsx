"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import ToppingItemCheckBox from "@/components/dish/ToppingItemCheckBox";
import ToppingItemRadio from "@/components/dish/ToppingItemRadio";
import { useCart } from "@/context/cartContext";
import { dishService } from "@/api/dishService";
import { useAuth } from "@/context/authContext";
import { cartService } from "@/api/cartService";

const page = () => {
  const { id: storeId, dishId } = useParams();

  const [dishInfo, setDishInfo] = useState(null);
  const [storeCart, setStoreCart] = useState(null);
  const [dishCart, setDishCart] = useState(null);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [cartItem, setCartItem] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [toppingsValue, setToppingsValue] = useState([]);
  const [price, setPrice] = useState(0);

  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const getDishInfo = async () => {
    try {
      const response = await dishService.getDish(dishId);
      setDishInfo(response.data);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    if (dishId) {
      getDishInfo();
    }
  }, [dishId]);

  useEffect(() => {
    if (cart) {
      const store = cart.find((c) => c.storeId === storeId);
      setStoreCart(store);

      const dish = store?.items.find((item) => item.dishId === dishId);
      setDishCart(dish);

      if (dish?.note) {
        setNote(dish.note);
      } else {
        setNote("");
      }
    }
  }, [cart, storeId, dishId]);

  const handleQuantityInputChange = (e) => {
    let inputValue = parseInt(e.target.value, 10);

    if (isNaN(inputValue)) {
      setQuantity(0);
      return;
    }

    // Correct logic
    if (inputValue > 50) {
      //toast.info("Số lượng tối đa là 50. Đã tự động điều chỉnh.");
      inputValue = 50;
    }

    // Negative Testing
    if (inputValue < 0) {
      //toast.info("Số lượng tối thiểu là 0. Đã tự động điều chỉnh.");
      inputValue = 0;
    }

    setQuantity(inputValue);

    const dishPrice = Number(dishInfo?.price || 0) * inputValue;
    const toppingsPrice = toppingsValue.reduce((sum, topping) => sum + Number(topping.price || 0), 0) * inputValue;

    setPrice(dishPrice + toppingsPrice);
  };

  useEffect(() => {
    if (storeCart) {
      const item = storeCart.items.find((item) => item.dish._id === dishId);

      setCartItem(item);
      setQuantity(item?.quantity || 0);

      if (item?.toppings.length > 0) {
        item.toppings.forEach((topping) => {
          setToppings((prev) => {
            if (prev.includes(topping._id)) {
              return [...prev];
            } else {
              return [...prev, topping._id];
            }
          });

          setToppingsValue((prev) => {
            if (prev.some((tp) => tp._id === topping._id)) {
              return [...prev];
            } else {
              return [
                ...prev,
                {
                  ...topping,
                  groupId: topping.toppingGroup,
                },
              ];
            }
          });
        });
      }
    }
  }, [storeCart]);

  useEffect(() => {
    if (cartItem) {
      const dishPrice = Number(cartItem.dish?.price || 0) * Number(cartItem.quantity);
      const toppingsPrice =
        (Array.isArray(cartItem.toppings)
          ? cartItem.toppings.reduce((sum, topping) => sum + Number(topping.price || 0), 0)
          : 0) * Number(cartItem.quantity);

      const totalPrice = dishPrice + toppingsPrice;

      setPrice(totalPrice);
    }
  }, [cartItem]);

  const handleChangeQuantity = (qnt) => {
    let newQuantity = quantity + qnt;

    if (newQuantity > 50) {
      //toast.info("Số lượng tối đa là 50. Đã tự động điều chỉnh.");
      newQuantity = 50;
    }

    if (newQuantity < 0) {
      //toast.info("Số lượng tối thiểu là 0. Đã tự động điều chỉnh.");
      newQuantity = 0;
    }

    setQuantity(newQuantity);

    const dishPrice = Number(dishInfo?.price || 0) * newQuantity;
    const toppingsPrice = toppingsValue.reduce((sum, topping) => sum + Number(topping.price || 0), 0) * newQuantity;

    setPrice(dishPrice + toppingsPrice);
  };

  const handleChooseTopping = (topping, toppingPrice, toppingGroup) => {
    const isRadio = toppingGroup.onlyOnce === true;

    if (isRadio) {
      const prevTopping = toppingsValue.find((item) => item.groupId === toppingGroup._id);

      if (prevTopping) {
        if (prevTopping._id === topping._id) {
          const priceChange = -prevTopping.price * quantity;
          setPrice((prev) => prev + priceChange);

          setToppings((prev) => prev.filter((id) => id !== topping._id));
          setToppingsValue((prev) => prev.filter((tp) => tp._id !== topping._id));
          return;
        } else {
          const priceChange = -prevTopping.price * quantity;
          setPrice((prev) => prev + priceChange);

          setToppings((prev) => prev.filter((id) => id !== prevTopping._id));
          setToppingsValue((prev) => prev.filter((tp) => tp._id !== prevTopping._id));
        }
      }

      setToppingsValue((prev) => {
        const updated = prev.filter((item) => item.groupId !== toppingGroup._id);
        return [...updated, { ...topping, groupId: toppingGroup._id }];
      });

      setToppings((prev) => [...prev, topping._id]);

      const priceChange = toppingPrice * quantity;
      setPrice((prev) => prev + priceChange);
    } else {
      let priceChange = 0;

      if (toppings.includes(topping._id)) {
        priceChange = -toppingPrice * quantity;
        setToppings((prev) => prev.filter((id) => id !== topping._id));
        setToppingsValue((prev) => prev.filter((tp) => tp._id !== topping._id));
      } else {
        priceChange = toppingPrice * quantity;
        setToppings((prev) => [...prev, topping._id]);
        setToppingsValue((prev) => [...prev, { ...topping, groupId: toppingGroup._id }]);
      }

      setPrice((prev) => prev + priceChange);
    }
  };

  const handleAddToCart = async () => {
    if (storeCart?.store?.openStatus === "CLOSED") {
      toast.error("Cửa hàng hiện đang đóng cửa, vui lòng quay lại sau!");
      return;
    }

    if (dishInfo?.stockStatus === "OUT_OF_STOCK") {
      toast.error("Món ăn này hiện đang hết hàng, vui lòng quay lại sau!");
      return;
    }

    if (user) {
      try {
        await cartService.updateCart({ storeId, dishId, quantity, toppings, note });
        toast.success("Cập nhật giỏ hàng thành công");
        refreshCart();
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
    }
  };

  const handleRemoveFromCart = async () => {
    if (user) {
      try {
        await cartService.updateCart({ storeId, dishId, quantity: 0, toppings });
        toast.success("Cập nhật giỏ hàng thành công");
        refreshCart();
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
    }
  };

  return (
    <>
      {dishInfo && (
        <>
          <div className='pb-[120px] md:pt-[75px] md:mt-[20px] bg-[#fff]'>
            <Heading title={dishInfo?.name} description='' keywords='' />
            <div className='hidden md:block'>
              <Header />
            </div>

            <div className='lg:w-[60%] md:w-[80%] md:mx-auto'>
              <div className='relative bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition'>
                <div className='absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-[20px] pt-[20px]'>
                  <Link
                    href={`/store/${storeId}`}
                    className='relative w-[40px] pt-[40px] rounded-full bg-[#e0e0e0a3] overflow-hidden'
                  >
                    <Image src='/assets/arrow_left_white.png' alt='' layout='fill' className='p-[8px]' />
                  </Link>
                </div>

                <div className='relative pt-[50%] z-0 md:pt-[40%] lg:pt-[35%]'>
                  <Image src={dishInfo?.image.url || ""} alt='' layout='fill' objectFit='contain' />
                </div>

                <div className='bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition'>
                  <div className='flex justify-between'>
                    <h3 className='text-[#4A4B4D] text-[28px] font-bold line-clamp-2' name='dishName'>
                      {dishInfo?.name}
                    </h3>
                    <span className='text-[#4A4B4D] text-[28px] font-bold' name='dishPrice'>
                      {Number(dishInfo?.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <p className='text-[#a4a5a8]'>{dishInfo?.description}</p>
                </div>

                <div className='h-[6px] w-full bg-gray-100 my-4 rounded-full'></div>

                {dishInfo.toppingGroups && dishInfo.toppingGroups.length > 0 && (
                  <>
                    <div className='bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition'>
                      {dishInfo.toppingGroups.map(
                        (toppingGroup, index) =>
                          toppingGroup.toppings.length > 0 && (
                            <div key={`${toppingGroup._id}-${index}`}>
                              <div className='flex gap-[10px]'>
                                <h3 className='text-[#4A4B4D] text-[20px] font-bold'>{toppingGroup.name}</h3>
                              </div>
                              {toppingGroup.onlyOnce
                                ? toppingGroup.toppings.map((topping) => (
                                    <ToppingItemRadio
                                      name='toppingItems'
                                      key={`${toppingGroup._id}-${topping._id}`}
                                      topping={topping}
                                      toppingGroup={toppingGroup}
                                      selectedTopping={toppingsValue}
                                      handleChooseTopping={handleChooseTopping}
                                    />
                                  ))
                                : toppingGroup.toppings.map((topping) => (
                                    <ToppingItemCheckBox
                                      name='toppingItems'
                                      key={`${toppingGroup._id}-${topping._id}`}
                                      topping={topping}
                                      selectedTopping={toppingsValue}
                                      toppingGroup={toppingGroup}
                                      handleChooseTopping={handleChooseTopping}
                                    />
                                  ))}
                            </div>
                          )
                      )}
                    </div>

                    {/* Divider */}
                    <div className='h-[6px] w-full bg-gray-100 my-4 rounded-full'></div>
                  </>
                )}

                <div className='bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition'>
                  <div className='pb-[20px]'>
                    <h3 className='text-[#4A4B4D] text-[20px] font-bold'>
                      Thêm lưu ý cho quán{" "}
                      <span className='text-[#a4a5a8] text-[16px] font-normal'>(Không bắt buộc)</span>
                    </h3>
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className='p-[10px] w-full border border-solid border-[#a3a3a3a3] rounded-[10px] focus:ring-2 focus:ring-[#fc6011] resize-none'
                    placeholder='Việc thực hiện yêu cầu còn tùy thuộc vào khả năng của quán'
                  />
                </div>

                <div className='h-[6px] w-full bg-gray-100 my-4 rounded-full'></div>

                <div className='flex items-center justify-center gap-4 bg-white p-5 border border-gray-100 rounded-2xl shadow-md md:p-6 hover:shadow-lg transition-all duration-200'>
                  {/* Nút giảm */}
                  <button
                    name='decreaseQuantityBtn'
                    onClick={(e) => {
                      e.preventDefault();
                      handleChangeQuantity(-1);
                    }}
                    className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 
               border border-gray-300 shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95'
                  >
                    <Image
                      src='/assets/minus.png'
                      alt='Decrease'
                      width={24}
                      height={24}
                      className='pointer-events-none'
                    />
                  </button>

                  {/* Input số lượng */}
                  <input
                    type='number'
                    value={quantity}
                    onChange={handleQuantityInputChange}
                    className='text-[#4A4B4D] text-2xl font-bold w-[70px] text-center bg-gray-50 border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#fc6011] transition-all duration-200'
                  />

                  {/* Nút tăng */}
                  <button
                    name='increaseQuantityBtn'
                    onClick={(e) => {
                      e.preventDefault();
                      handleChangeQuantity(1);
                    }}
                    className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gradient-to-r from-[#fc6011] to-[#ff7a33] 
               shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95'
                  >
                    <Image
                      src='/assets/plus_white.png'
                      alt='Increase'
                      width={24}
                      height={24}
                      className='pointer-events-none'
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 right-0 bg-white px-5 md:px-0 py-4 z-[100] flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)]'>
            {quantity > 0 ? (
              <div
                name='addCartBtn'
                className='flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#fc6011] to-[#ff7a33] text-white py-4 px-6 
                 lg:w-[60%] md:w-[80%] w-full md:mx-auto cursor-pointer shadow-md hover:shadow-lg 
                 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                onClick={handleAddToCart}
              >
                <span className='text-white text-xl font-semibold'>Thêm vào giỏ hàng</span>
                <span className='text-white text-xl font-semibold'>•</span>
                <span className='text-white text-xl font-semibold' name='totalPrice'>
                  {Number(price.toFixed(0)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-4 lg:w-[60%] md:w-[80%] w-full md:mx-auto'>
                <Link
                  href={`/store/${storeId}`}
                  className='flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#fc6011] to-[#ff7a33] text-white py-4 px-4 sm:px-6 
                   cursor-pointer w-[65%] md:w-[80%] shadow-md hover:shadow-lg 
                   transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                >
                  <span className='text-white text-xl font-semibold'>Quay lại cửa hàng</span>
                </Link>

                <div
                  className='flex items-center justify-center gap-2 rounded-2xl bg-gray-300 text-gray-700 py-4 px-4 sm:px-6 
                   cursor-pointer w-[35%] md:w-[20%] shadow-md hover:shadow-lg 
                   transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  onClick={handleRemoveFromCart}
                >
                  <span className='text-gray-700 text-xl font-semibold'>Bỏ chọn</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default page;
