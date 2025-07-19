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
        <div
          className='relative max-w-[100px] ml-[20px] flex flex-col items-center gap-[1px]'
          onClick={() => {
            setOpenSelectProvince(!openSelectProvince);
          }}
        >
          <div className='p-[6px] bg-red-600 rounded-full cursor-pointer'>
            <div className='relative w-[12px] pt-[13px]'>
              <Image src='/assets/star_yellow.png' alt='' layout='fill' objectFit='contain' />
            </div>
          </div>
          <p className='text-[12px] text-[#4a4b4d] whitespace-nowrap cursor-pointer'>{province.name}</p>

          {openSelectProvince && (
            <div className='absolute top-[50px] !left-[-65px] z-[100] h-[350px] w-[200px] overflow-y-scroll bg-white shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
              {provinces.map((prov) => (
                <div
                  key={prov.name}
                  onClick={() => {
                    setOpenSelectProvince(false);
                    handleProvinceChange(prov);
                  }}
                  className={`py-[15px] px-[20px] cursor-pointer ${
                    prov.name === province.name ? "bg-[#a3a3a3a3]" : "bg-[#fff]"
                  }`}
                  style={{ borderBottom: "1px solid #e0e0e0a3" }}
                >
                  <span className='text-[#4a4b4d] font-bold text-[15px]'>{prov.name}</span>
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
