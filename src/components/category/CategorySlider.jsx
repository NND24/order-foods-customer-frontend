"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import CategoryItem from "./CategoryItem";
import { systemCategoryService } from "@/api/systemCategoryService";

const CategorySlider = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await systemCategoryService.getAllSystemCategory();
        setAllCategory(result || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  return (
    <Swiper
      className='category-slider'
      grabCursor={true}
      breakpoints={{
        320: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        490: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 8,
          spaceBetween: 25,
        },
        1280: {
          slidesPerView: 10,
          spaceBetween: 25,
        },
      }}
    >
      {allCategory &&
        allCategory.map((type) => (
          <SwiperSlide key={type._id}>
            <CategoryItem type={type} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CategorySlider;
