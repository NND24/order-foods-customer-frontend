import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { provinces } from "@/utils/constants";
import { getClosestProvince } from "@/utils/functions";

const MobileHeader = ({ page }) => {
  const [province, setProvince] = useState({ name: "", lat: 200, lon: 200 });
  const [openSelectProvince, setOpenSelectProvince] = useState(false);

  const { user } = useAuth();

  const handleProvinceChange = (prov) => {
    setProvince(prov);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;

          setProvince(getClosestProvince({ lat: userLat, lon: userLon }));
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error);
        }
      );
    }
  }, []);

  return (
    <div className='px-[20px] flex items-center justify-between md:hidden'>
      <Link href='/home' className='relative w-[60px] pt-[60px] h-[60px]'>
        <Image src='/assets/logo_app.png' layout='fill' objectFit='contain' alt='' />
      </Link>
      <div className='flex items-center gap-[15px]'>
        <div className='relative'>
          <button
            className='flex items-center gap-2 p-2 bg-gradient-to-r from-[#fc6011] to-[#ff8533] rounded-full text-white font-medium shadow-md hover:shadow-lg transition'
            onClick={() => setOpenSelectProvince(!openSelectProvince)}
          >
            <Image src='/assets/star_yellow.png' alt='Location' width={18} height={18} className='drop-shadow-md' />
            <span className='text-sm whitespace-nowrap'>{province.name || "Chọn tỉnh"}</span>
          </button>

          {openSelectProvince && (
            <div className='absolute top-[60px] right-[-50px] z-[100] h-[350px] w-[220px] bg-white rounded-lg overflow-y-auto shadow-xl border border-gray-200 animate-fadeIn'>
              {provinces.map((prov) => (
                <div
                  key={prov.name}
                  onClick={() => {
                    setOpenSelectProvince(false);
                    handleProvinceChange(prov);
                  }}
                  className={`py-3 px-4 cursor-pointer hover:bg-[#fc6011]/10 ${
                    prov.name === province.name ? "bg-[#fc6011]/20 font-bold text-[#fc6011]" : "text-gray-700"
                  }`}
                >
                  {prov.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {user && (
          <>
            <Link href='/notifications' className='relative group flex flex-col items-center gap-[1px]'>
              <Image
                src='/assets/notification.png'
                alt=''
                width={24}
                height={24}
                className={`group-hover:hidden  ${page == "notifications" ? "!hidden" : ""}`}
              />
              <Image
                src='/assets/notification_active.png'
                alt=''
                width={24}
                height={24}
                className={`hidden group-hover:block ${page == "notifications" ? "!block" : ""}`}
              />
              <p
                className={`text-[12px] group-hover:text-[#fc6011] ${
                  page == "notifications" ? "text-[#fc6011]" : "text-[#4A4B4D]"
                }`}
              >
                Thông báo
              </p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
