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
import { React, useEffect, useState } from "react";
import { storeService } from "@/api/storeService";
import { dishService } from "@/api/dishService";
import { favoriteService } from "@/api/favoriteService";
import { ratingService } from "@/api/ratingService";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const { cart } = useCart();
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

          <div className='bg-white lg:w-[75%] md:w-[80%] md:mx-auto md:rounded-2xl md:shadow-md mb-6 overflow-hidden'>
            {/* Cover */}
            <div className='relative pt-[45%] lg:pt-[30%] overflow-hidden'>
              <Image
                src={storeInfo?.cover?.url || "/assets/logo_app.png"}
                alt='Store Cover'
                layout='fill'
                loading='lazy'
                objectFit='cover'
                className='rounded-t-2xl transition-transform duration-300 hover:scale-105'
              />
            </div>

            {/* Info Card */}
            <div className='flex gap-5 mx-5 mt-[-50px] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 relative z-10'>
              {/* Avatar */}
              <div className='relative w-[100px] h-[100px] rounded-xl overflow-hidden ring-4 ring-white shadow-md'>
                <Image
                  src={storeInfo?.avatar?.url || "/assets/logo_app.png"}
                  alt='Store Avatar'
                  layout='fill'
                  loading='lazy'
                  objectFit='cover'
                />
              </div>

              {/* Store Info */}
              <div className='flex flex-1 items-start justify-between min-w-0'>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[#4A4B4D] text-xl font-bold truncate'>{storeInfo?.name}</span>

                  {/* Categories */}
                  <div className='flex flex-wrap gap-2 items-center mt-1 text-sm text-gray-500'>
                    {storeInfo?.storeCategory &&
                      storeInfo?.storeCategory.map((category, index) => (
                        <div key={category._id || index} className='flex items-center gap-2'>
                          <Link href={`/search?category=${category._id}`} className='hover:text-[#fc6011] transition'>
                            {category.name}
                          </Link>
                          {index !== storeInfo.storeCategory.length - 1 && (
                            <span className='inline-block w-1 h-1 bg-[#fc6011] rounded-full'></span>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Rating */}
                  <div className='flex items-center gap-2 mt-1 text-sm'>
                    {storeInfo?.avgRating !== 0 && (
                      <>
                        <Image src='/assets/star_active.png' alt='rating' width={18} height={18} />
                        <span className='text-[#fc6011] font-medium'>{storeInfo?.avgRating.toFixed(2)}</span>
                      </>
                    )}
                    {storeInfo?.amountRating !== 0 && (
                      <span className='text-gray-500'>({storeInfo?.amountRating} đánh giá)</span>
                    )}
                  </div>

                  {/* Description */}
                  {storeInfo?.description && (
                    <span className='text-gray-500 text-sm pt-1 line-clamp-1'>{storeInfo?.description}</span>
                  )}
                </div>

                {/* Favorite */}
                {user && (
                  <div className='hidden md:block'>
                    <button onClick={handleAddToFavorite} className='p-2 rounded-full hover:scale-110 transition'>
                      <Image
                        src={`/assets/favorite${storeFavorite ? "-active" : ""}.png`}
                        alt='favorite'
                        width={28}
                        height={28}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className='px-5 md:px-6 mt-[20px] pb-6'>
              {allDish && (
                <div className='mb-6'>
                  <h3 className='text-[#4A4B4D] text-xl font-bold mb-3'>Dành cho bạn</h3>
                  <ListDishBig storeInfo={storeInfo} allDish={allDish} cartItems={storeCart ? storeCart?.items : []} />
                </div>
              )}

              {allDish && (
                <div className='mb-6'>
                  <ListDish storeInfo={storeInfo} allDish={allDish} cartItems={storeCart ? storeCart?.items : []} />
                </div>
              )}

              {/* Map */}
              <div className='w-full h-[150px] my-4 relative rounded-xl overflow-hidden shadow-md'>
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

              {/* Ratings */}
              {allStoreRating &&
                allStoreRatingDesc &&
                paginationRating &&
                allStoreRating?.data?.length > 0 &&
                allStoreRatingDesc?.data?.length > 0 &&
                paginationRating?.data?.length > 0 &&
                ratings && (
                  <>
                    <div className='p-5 bg-gray-100 md:rounded-xl mb-4 shadow-inner'>
                      <div className='flex items-center justify-between pb-3'>
                        <h3 className='text-[#4A4B4D] text-xl font-bold'>Mọi người nhận xét</h3>
                        <Link href={`/store/${storeId}/rating`} className='block md:hidden'>
                          <Image
                            src='/assets/arrow_right_long.png'
                            alt='arrow'
                            width={40}
                            height={40}
                            className='bg-white p-2 rounded-full shadow-md'
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
                            userId={user?._id}
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
              <div
                className='flex items-center justify-between 
                rounded-xl 
                bg-gradient-to-r from-[#fc6011] to-[#ff7e3c]
                text-white py-4 px-6 
                lg:w-[75%] md:w-[80%] w-full md:mx-auto 
                shadow-md hover:shadow-lg
                transition-all duration-300 hover:scale-[1.02]'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-lg md:text-xl font-semibold'>Giỏ hàng</span>
                  <div className='w-[5px] h-[5px] rounded-full bg-white'></div>
                  <span className='text-lg md:text-xl font-semibold'>{cartQuantity} món</span>
                </div>
                <span className='text-lg md:text-xl font-bold bg-white/20 px-3 py-1 rounded-md'>
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
