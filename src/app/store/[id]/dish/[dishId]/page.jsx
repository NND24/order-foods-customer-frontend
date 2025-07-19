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
  const router = useRouter();
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
          <div className='pb-[120px] md:pt-[75px] md:mt-[20px] bg-[#fff] md:bg-[#f9f9f9]'>
            <Heading title={dishInfo?.name} description='' keywords='' />
            <div className='hidden md:block'>
              <Header />
            </div>

            <div className='relative bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
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

              <div className='p-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
                <div className='flex justify-between'>
                  <h3 className='text-[#4A4B4D] text-[28px] font-bold' name='dishName'>
                    {dishInfo?.name}
                  </h3>
                  <span className='text-[#4A4B4D] text-[28px] font-bold' name='dishPrice'>
                    {Number(dishInfo?.price).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <p className='text-[#a4a5a8]'>{dishInfo?.description}</p>
              </div>

              {dishInfo.toppingGroups && dishInfo.toppingGroups.length > 0 && (
                <div className='px-[20px] pb-[20px]' style={{ borderBottom: "6px solid #e0e0e0a3" }}>
                  {dishInfo.toppingGroups?.map((toppingGroup) => (
                    <>
                      {toppingGroup.toppings.length > 0 && (
                        <div key={toppingGroup._id}>
                          <div className='flex gap-[10px] pt-[20px]'>
                            <h3 className='text-[#4A4B4D] text-[20px] font-bold'>{toppingGroup.name}</h3>
                          </div>
                          {toppingGroup.onlyOnce
                            ? toppingGroup.toppings.map((topping) => (
                                <ToppingItemRadio
                                  name='toppingItems'
                                  key={topping._id}
                                  topping={topping}
                                  toppingGroup={toppingGroup}
                                  selectedTopping={toppingsValue}
                                  handleChooseTopping={handleChooseTopping}
                                />
                              ))
                            : toppingGroup.toppings.map((topping) => (
                                <ToppingItemCheckBox
                                  name='toppingItems'
                                  key={topping._id}
                                  topping={topping}
                                  selectedTopping={toppingsValue}
                                  toppingGroup={toppingGroup}
                                  handleChooseTopping={handleChooseTopping}
                                />
                              ))}
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )}

              <div className='py-[20px]'>
                <div className='flex gap-[10px] px-[20px] pb-[20px]'>
                  <h3 className='text-[#4A4B4D] text-[20px] font-bold'>Thêm lưu ý cho quán</h3>
                  <span className='text-[#a4a5a8]'>Không bắt buộc</span>
                </div>
                <div
                  className='p-[20px]'
                  style={{ borderBottom: "1px solid #a3a3a3a3", borderTop: "1px solid #a3a3a3a3" }}
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className='p-[10px] w-full border border-solid border-[#a3a3a3a3] rounded-[10px]'
                    placeholder='Việc thực hiện yêu cầu còn tùy thuộc vào khả năng của quán'
                  />
                </div>
              </div>

              <div className='p-[20px] flex items-center justify-center gap-[5px]'>
                <Image
                  name='decreaseQuantityBtn'
                  src='/assets/minus.png'
                  alt=''
                  width={50}
                  height={50}
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(-1);
                  }}
                  className='border border-[#a3a3a3a3] border-solid rounded-[6px] p-[8px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] cursor-pointer'
                />
                <input
                  type='number'
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  className='text-[#4A4B4D] text-[24px] font-bold w-[60px] text-center bg-transparent'
                />
                <Image
                  name='increaseQuantityBtn'
                  src='/assets/plus_active.png'
                  alt=''
                  width={50}
                  height={50}
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(1);
                  }}
                  className='border border-[#a3a3a3a3] border-solid rounded-[6px] p-[8px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] cursor-pointer'
                />
              </div>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] md:px-0 py-[15px] z-[100] flex items-center justify-center'>
            {quantity > 0 ? (
              <div
                name='addCartBtn'
                className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] lg:w-[60%] md:w-[80%] w-full md:mx-auto cursor-pointer shadow-md hover:shadow-lg'
                onClick={handleAddToCart}
              >
                <span className='text-[#fff] text-[20px] font-semibold'>Thêm vào giỏ hàng</span>
                <span className='text-[#fff] text-[20px] font-semibold'>-</span>
                <span className='text-[#fff] text-[20px] font-semibold' name='totalPrice'>
                  {Number(price.toFixed(0)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-[10px] lg:w-[60%] md:w-[80%] w-full md:mx-auto '>
                <Link
                  href={`/store/${storeId}`}
                  className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] cursor-pointer w-[65%] md:w-[80%] shadow-md hover:shadow-lg'
                >
                  <span className='text-[#fff] text-[20px] font-semibold'>Quay lại cửa hàng</span>
                </Link>

                <div
                  className='flex items-center justify-center gap-[6px] rounded-[8px] bg-[#c9c8c8] text-[#fff] py-[15px] px-[20px] cursor-pointer w-[35%] md:w-[20%] shadow-md hover:shadow-lg'
                  onClick={handleRemoveFromCart}
                >
                  <span className='text-[#4a4b4d] text-[20px] font-semibold'>Bỏ chọn</span>
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
