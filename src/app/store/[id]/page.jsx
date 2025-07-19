"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useCart } from "@/context/cartContext";
import { useFavorite } from "@/context/favoriteContext";
import ListDish from "@/components/dish/ListDish";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import ListDishBig from "@/components/dish/ListDishBig";
import RatingItem from "@/components/rating/RatingItem";
import RatingBar from "@/components/rating/RatingBar";
import MostRatingSlider from "@/components/rating/MostRatingSlider";
import { useSocket } from "@/context/socketContext";
import { useEffect, useState } from "react";
import { storeService } from "@/api/storeService";
import { dishService } from "@/api/dishService";
import { favoriteService } from "@/api/favoriteService";
import { ratingService } from "@/api/ratingService";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/1689/1689246.png",
  iconSize: [40, 40],
});

const page = () => {
  const { id: storeId } = useParams();
  const searchParams = useSearchParams();

  const [storeInfo, setStoreInfo] = useState(null);
  const [allDish, setAllDish] = useState(null);
  const [storeCart, setStoreCart] = useState(null);
  const [storeFavorite, setStoreFavorite] = useState(null);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [allStoreRating, setAllStoreRating] = useState(null);
  const [paginationRating, setPaginationRating] = useState(null);
  const [allStoreRatingDesc, setAllStoreRatingDesc] = useState(null);

  const { notifications } = useSocket();
  const { cart, refreshCart } = useCart();
  const { favorite, refreshFavorite } = useFavorite();
  const { user } = useAuth();

  const getStoreInfo = async () => {
    try {
      const response = await storeService.getStoreInformation(storeId);
      setStoreInfo(response.data);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const getAllDish = async () => {
    try {
      const response = await dishService.getAllDish(storeId);
      setAllDish(response.data);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const getAllStoreRating = async () => {
    try {
      const response = await ratingService.getAllStoreRating({
        storeId,
        sort: "",
        limit: "",
        page: "",
      });
      setAllStoreRating(response);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const getPaginationRating = async () => {
    try {
      const response = await ratingService.getAllStoreRating({
        storeId,
        sort: "",
        limit,
        page,
      });
      setPaginationRating(response);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const getAllStoreRatingDesc = async () => {
    try {
      const response = await ratingService.getAllStoreRating({
        storeId,
        sort: "desc",
        limit: "5",
        page: "1",
      });
      setAllStoreRatingDesc(response);
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    if (storeId) {
      getStoreInfo();
      getAllDish();
      getAllStoreRating();
      getPaginationRating();
      getAllStoreRatingDesc();
    }
  }, [storeId]);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "6";

  useEffect(() => {
    if (allStoreRating) {
      const allRatings = allStoreRating?.data?.reduce(
        (acc, item) => {
          acc[item.ratingValue] = (acc[item.ratingValue] || 0) + 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      );

      setRatings(allRatings);
    }
  }, [allStoreRating]);

  const calculateCartPrice = () => {
    const { totalPrice, totalQuantity } = storeCart.items.reduce(
      (acc, item) => {
        const dishPrice = Number(item.dish?.price || 0) * Number(item.quantity || 0);

        const toppingsPrice =
          (Array.isArray(item.toppings)
            ? item.toppings.reduce((sum, topping) => sum + Number(topping.price || 0), 0)
            : 0) * Number(item.quantity || 0);

        acc.totalPrice += dishPrice + toppingsPrice;
        acc.totalQuantity += item.quantity;

        return acc;
      },
      { totalPrice: 0, totalQuantity: 0 }
    );

    setCartPrice(totalPrice);
    setCartQuantity(totalQuantity);
  };

  useEffect(() => {
    if (cart) {
      setStoreCart(cart.find((cart) => cart.store._id === storeId));
    } else {
      setStoreCart(null);
    }
  }, [cart]);

  useEffect(() => {
    if (storeId) {
      getPaginationRating();
    }
  }, [page, limit, storeId]);

  useEffect(() => {
    if (storeCart) {
      calculateCartPrice();
    }
  }, [storeCart]);

  useEffect(() => {
    if (favorite && Array.isArray(favorite.store)) {
      setStoreFavorite(favorite.store.some((s) => s._id === storeId));
    } else {
      setStoreFavorite(null);
    }
  }, [favorite]);

  const handleAddToFavorite = async () => {
    if (storeFavorite) {
      try {
        await favoriteService.removeFavorite(storeId);
        refreshFavorite();
      } catch (error) {
        toast.error(error?.data?.message || "Có lỗi xảy ra!");
      }
    } else {
      try {
        await favoriteService.addFavorite(storeId);
        refreshFavorite();
      } catch (error) {
        toast.error(error?.data?.message || "Có lỗi xảy ra!");
      }
    }
  };

  return (
    <>
      {storeInfo && (
        <div className={` bg-[#fff] md:bg-[#f9f9f9] ${cartQuantity > 0 ? "pb-[90px]" : ""}`}>
          <Heading title={storeInfo?.name} description='' keywords='' />
          <div className='hidden md:block'>
            <Header />
          </div>

          <div className='fixed top-0 right-0 left-0 z-10 flex items-center justify-between p-[20px] bg-[#00000036] md:hidden'>
            <Link href='/home'>
              <Image src='/assets/arrow_left_white.png' alt='' width={30} height={30} />
            </Link>
            {user && (
              <div className='relative flex items-center gap-[20px]'>
                <Image
                  src={`/assets/favorite${storeFavorite ? "-active" : "_white"}.png`}
                  alt=''
                  width={30}
                  height={30}
                  onClick={() => {
                    handleAddToFavorite();
                  }}
                  className='cursor-pointer'
                />
                <Image src='/assets/notification_white.png' alt='' className='cursor-pointer' width={30} height={30} />

                {notifications.filter((noti) => noti.status === "unread").length > 0 && (
                  <div className='absolute top-[-6px] right-[-6px] w-[21px] h-[21px] text-center rounded-full bg-[#fc6011] border-solid border-[1px] border-white flex items-center justify-center'>
                    <span className='text-[11px] text-white'>
                      {notifications.filter((noti) => noti.status === "unread").length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='bg-[#fff] lg:w-[75%] md:w-[80%] pb-[20px] mb-[20px] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-br-[10px] md:rounded-bl-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
            <div className='relative pt-[50%] z-0 lg:pt-[35%] rounded-br-[8px] rounded-bl-[8px] overflow-hidden'>
              <Image
                src={storeInfo?.cover?.url || "/assets/logo_app.png"}
                alt=''
                layout='fill'
                loading='lazy'
                objectFit='cover'
              />
            </div>

            <div className='flex gap-[20px] my-[20px] mx-[20px] items-start bg-[#fff] translate-y-[-60%] mb-[-10%] p-[10px] rounded-[6px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
              <div className='relative w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] rounded-[8px] overflow-hidden'>
                <Image
                  src={storeInfo?.avatar?.url || "/assets/logo_app.png"}
                  alt=''
                  layout='fill'
                  loading='lazy'
                  objectFit='cover'
                />
              </div>

              <div className='flex flex-1 items-start justify-between min-w-0'>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[#4A4B4D] text-[20px] font-semibold line-clamp-1'>{storeInfo?.name}</span>

                  <div className='flex items-center gap-[6px] min-w-0 overflow-hidden whitespace-nowrap text-ellipsis lg:flex-wrap lg:whitespace-normal'>
                    {storeInfo?.storeCategory.map((category, index) => (
                      <div className='flex items-center gap-[6px]' key={category._id}>
                        <Link href={`/search?category=${category._id}`} className='text-[#636464]'>
                          {category.name}
                        </Link>
                        {index !== storeInfo.storeCategory.length - 1 && (
                          <div className='w-[4px] h-[4px] rounded-full bg-[#fc6011]'></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className='flex items-center gap-[6px]'>
                    {storeInfo?.avgRating != 0 && (
                      <>
                        <Image src='/assets/star_active.png' alt='' width={20} height={20} />
                        <span className='text-[#fc6011]'>{storeInfo?.avgRating.toFixed(2)}</span>
                      </>
                    )}
                    {storeInfo?.amountRating != 0 && (
                      <span className='text-[#636464]'>{`(${storeInfo?.amountRating} đánh giá)`}</span>
                    )}
                  </div>

                  {storeInfo?.description && (
                    <span className='text-[#636464] pt-[4px] line-clamp-1'>{storeInfo?.description}</span>
                  )}
                </div>

                {user && (
                  <div className='hidden md:block'>
                    <div
                      className='flex items-center gap-[5px] p-[6px] cursor-pointer'
                      onClick={() => {
                        handleAddToFavorite();
                      }}
                    >
                      <Image
                        src={`/assets/favorite${storeFavorite ? "-active" : ""}.png`}
                        alt=''
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='md:p-[20px] mt-[-60px]'>
              {allDish && (
                <div className='mb-[20px] px-[20px] md:px-0'>
                  <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Dành cho bạn</h3>
                  <ListDishBig storeInfo={storeInfo} allDish={allDish} cartItems={storeCart ? storeCart?.items : []} />
                </div>
              )}

              {allDish && (
                <div className='my-[20px] px-[20px] md:px-0'>
                  <ListDish storeInfo={storeInfo} allDish={allDish} cartItems={storeCart ? storeCart?.items : []} />
                </div>
              )}

              <div className='w-full h-[150px] my-4 relative z-0 rounded-[10px] overflow-hidden'>
                {typeof window !== "undefined" && storeInfo?.address && storeInfo?.address.lat && (
                  <MapContainer
                    key={`${storeInfo.address.lat}-${storeInfo.address.lon}`}
                    center={[storeInfo.address.lat, storeInfo.address.lon]}
                    zoom='12'
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                    <Marker position={[storeInfo.address.lat, storeInfo.address.lon]} icon={homeIcon}>
                      <Popup>{storeInfo?.address.full_address || "Cửa hàng"}</Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>

              {allStoreRating &&
                allStoreRatingDesc &&
                paginationRating &&
                allStoreRating?.data?.length > 0 &&
                allStoreRatingDesc?.data?.length > 0 &&
                paginationRating?.data?.length > 0 &&
                ratings && (
                  <>
                    <div className='p-[20px] bg-[#e6e6e6] md:rounded-[10px]'>
                      <div className='flex items-center justify-between pb-[10px]'>
                        <h3 className='text-[#4A4B4D] text-[24px] font-bold pb-[10px]'>Mọi người nhận xét</h3>
                        <Link href={`/store/${storeId}/rating`} className='block md:hidden'>
                          <Image
                            src='/assets/arrow_right_long.png'
                            alt=''
                            width={40}
                            height={40}
                            className='bg-[#fff] p-[8px] rounded-full shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'
                          />
                        </Link>
                      </div>

                      <MostRatingSlider allStoreRatingDesc={allStoreRatingDesc.data} />
                    </div>

                    <div className='hidden md:block'>
                      <RatingBar ratings={ratings} />
                      {paginationRating &&
                        paginationRating.data.map((rating) => (
                          <RatingItem
                            key={rating._id}
                            rating={rating}
                            userId={user._id}
                            refetchAllStoreRating={getAllStoreRating}
                            refetchPaginationRating={getPaginationRating}
                            refetchAllStoreRatingDesc={getAllStoreRatingDesc}
                          />
                        ))}
                      {paginationRating && <Pagination page={page} limit={limit} total={paginationRating.total} />}
                    </div>
                  </>
                )}
            </div>
          </div>

          {cartQuantity > 0 && storeCart && (
            <Link
              name='cartDetailBtn'
              href={`/store/${storeId}/cart`}
              className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] py-[15px] z-[100] flex items-center justify-center'
            >
              <div className='flex items-center justify-between rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] lg:w-[75%] md:w-[80%] w-full md:mx-auto shadow-md hover:shadow-lg'>
                <div className='flex items-center gap-[8px]'>
                  <span className='text-[#fff] text-[20px] font-semibold'>Giỏ hàng</span>
                  <div className='w-[4px] h-[4px] rounded-full bg-[#fff]'></div>
                  <span className='text-[#fff] text-[20px] font-semibold'>{cartQuantity} món</span>
                </div>
                <span className='text-[#fff] text-[20px] font-semibold'>
                  {Number(cartPrice.toFixed(0)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default page;
