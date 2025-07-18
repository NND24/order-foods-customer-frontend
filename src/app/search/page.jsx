"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header/Header";
import NavBar from "@/components/header/NavBar";
import Heading from "@/components/Heading";
import StoreBigCard from "@/components/store/StoreBigCard";
import CategorySlider from "@/components/category/CategorySlider";
import { useStoreSearch } from "@/hooks/useStoreSearch";
import StoreSmallCard from "@/components/store/StoreSmallCard";
import Pagination from "@/components/Pagination";
import SortBy from "@/components/filter/SortBy";
import CategoryFilter from "@/components/filter/CategoryFilter";

const page = () => {
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState(null);

  const query = useMemo(
    () => ({
      name: searchParams.get("name") || "",
      category: searchParams.get("category") || "",
      sort: searchParams.get("sort") || "",
      limit: searchParams.get("limit") || "20",
      page: searchParams.get("page") || "1",
    }),
    [searchParams.toString()]
  );

  const { allStore, ratingStore, standoutStore, loading, error } = useStoreSearch(query);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, allStore]);

  return (
    <>
      <Heading title='Tìm kiếm' description='' keywords='' />
      {openFilter ? (
        <div className='pb-[160px] pt-[85px]'>
          <div className='fixed top-0 right-0 left-0 z-10 flex items-center gap-[20px] bg-[#fff] h-[85px] px-[20px]'>
            <Image
              src='/assets/close.png'
              className='cursor-pointer'
              alt=''
              width={25}
              height={25}
              onClick={() => setOpenFilter(null)}
            />
          </div>

          {openFilter === "All Filter" ? (
            <>
              <SortBy />
              <CategoryFilter />
            </>
          ) : openFilter === "Sort By" ? (
            <SortBy />
          ) : (
            <CategoryFilter />
          )}
        </div>
      ) : (
        <div className='pt-[150px] pb-[100px]  px-[20px] md:pt-[90px] md:w-[90%] md:mx-auto md:px-0'>
          <Header />

          <div className='py-[20px]'>
            <CategorySlider />

            <div className='grid grid-cols-12 gap-[35px] md:mt-[20px]'>
              <div className='xl:col-span-9 lg:col-span-8 md:col-span-8 col-span-12'>
                <div className='block md:hidden'>
                  <div className='flex items-center gap-[15px] overflow-x-auto whitespace-nowrap my-[15px]'>
                    <div
                      className='flex items-center gap-[10px] bg-[#e8e9e9] rounded-[15px] px-[15px] py-[10px] md:py-[6px] z-10 cursor-pointer'
                      onClick={() => setOpenFilter("All Filter")}
                    >
                      <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
                        <Image src='/assets/filter.png' alt='' layout='fill' objectFit='fill' />
                      </div>
                    </div>

                    <div
                      className='relative flex items-center gap-[10px] bg-[#e8e9e9] rounded-[15px] px-[15px] py-[10px] md:py-[6px] cursor-pointer'
                      onClick={() => setOpenFilter("Sort By")}
                    >
                      <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
                        <Image src='/assets/arrow_up_down.png' alt='' layout='fill' objectFit='fill' />
                      </div>
                      <span className='text-[#4A4B4D] text-[18px] md:text-[16px]'>Sắp xếp theo</span>
                    </div>

                    <div
                      className='flex items-center gap-[10px] bg-[#e8e9e9] rounded-[15px] px-[15px] py-[10px] md:py-[6px] cursor-pointer'
                      onClick={() => setOpenFilter("Category Filter")}
                    >
                      <div className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px]'>
                        <Image src='/assets/promotion.png' alt='' layout='fill' objectFit='fill' />
                      </div>
                      <span className='text-[#4A4B4D] text-[18px] md:text-[16px]'>Danh mục</span>
                    </div>
                    <Link
                      href='/search'
                      className='text-[#0054ff] text-[18px] md:text-[16px] font-semibold cursor-pointer'
                    >
                      Làm mới
                    </Link>
                  </div>
                </div>

                <div className='hidden md:block z-0'>
                  <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-[20px]'>
                    {allStore?.data?.length > 0 ? (
                      allStore?.data.map((store) => <StoreBigCard key={store._id} store={store} />)
                    ) : (
                      <h3 className='text-[20px] text-[#4a4b4d] font-semibold'>Không tìm thấy cửa hàng nào</h3>
                    )}
                  </div>
                </div>
              </div>

              <div className='xl:col-span-3 lg:col-span-4 md:col-span-4 hidden md:block'>
                <div className='rounded-md mb-6 bg-[#fff] overflow-hidden shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
                  <SortBy />
                </div>

                <div className='rounded-md mb-6 bg-[#fff] overflow-hidden shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
                  <h3 className='text-[#4A4B4D] text-[20px] bg-[#e8e9e9] text-center px-4 py-3 font-semibold'>
                    Quán ăn nổi bật
                  </h3>
                  <ul className='flex flex-col gap-[8px] p-[8px] max-h-[255px] w-full overflow-y-auto overflow-x-hidden small-scrollbar box-border'>
                    {standoutStore?.data?.length > 0 &&
                      standoutStore.data.map((store) => <StoreSmallCard key={store._id} store={store} />)}
                  </ul>
                </div>

                <div className='rounded-md mb-6 bg-[#fff] overflow-hidden shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
                  <h3 className='text-[#4A4B4D] text-[20px] bg-[#e8e9e9] text-center px-4 py-3 font-semibold'>
                    Quán ăn được đánh giá tốt
                  </h3>
                  <ul className='flex flex-col gap-[8px] p-[8px] max-h-[255px] w-full overflow-y-auto overflow-x-hidden small-scrollbar box-border'>
                    {ratingStore?.data?.length > 0 &&
                      ratingStore.data.map((store) => <StoreSmallCard key={store._id} store={store} />)}
                  </ul>
                </div>

                <div className='rounded-md mb-6 bg-[#fff] overflow-hidden shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
                  <CategoryFilter />
                </div>
              </div>
            </div>

            <div className='block md:hidden'>
              <div className='flex flex-col gap-[10px]'>
                {allStore?.data?.length > 0 ? (
                  allStore.data.map((store) => <StoreBigCard key={store._id} store={store} />)
                ) : (
                  <h3 className='text-[20px] text-[#4a4b4d] font-semibold'>Không tìm thấy cửa hàng nào</h3>
                )}
              </div>
            </div>

            {allStore?.data?.length > 0 && <Pagination page={page} limit={query.limit} total={allStore.total} />}
          </div>
        </div>
      )}
      {!openFilter && (
        <div className='md:hidden'>
          <NavBar page='' />
        </div>
      )}
    </>
  );
};

export default page;
