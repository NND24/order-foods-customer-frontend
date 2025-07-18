"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { systemCategoryService } from "@/api/systemCategoryService";

const CategoryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setSelectedCategories(category !== "" ? category.split(",") : []);
  }, [category]);

  const handleCategoryClick = (typeId) => {
    let updatedCategories = [...selectedCategories];

    if (updatedCategories.includes(typeId)) {
      // Nếu đã chọn, thì bỏ chọn
      updatedCategories = updatedCategories.filter((id) => id !== typeId);
    } else {
      // Nếu chưa chọn, thì thêm vào danh sách
      updatedCategories.push(typeId);
    }

    setSelectedCategories(updatedCategories);

    // Cập nhật URL
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (updatedCategories.length > 0) params.set("category", updatedCategories.join(","));
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", limit);
    if (page) params.set("page", page);

    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await systemCategoryService.getAllSystemCategory();
        setAllCategories(result.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <div className='bg-[#e8e9e9] px-[20px] py-[15px] md:text-[20px] md:text-center md:px-4 md:py-2 md:font-semibold'>
        <span className='text-[#4A4B4D] mb-[10px]'>Danh mục</span>
      </div>

      <div className='max-h-[500px] md:max-h-[280px] overflow-auto small-scrollbar'>
        {allCategories &&
          allCategories.map((category) => (
            <div
              key={category._id}
              className='flex gap-[15px] p-[20px] md:p-[10px] cursor-pointer'
              style={{ borderBottom: "1px solid #a3a3a3a3" }}
              onClick={() => {
                handleCategoryClick(category._id);
              }}
            >
              <div className='flex flex-1 items-center justify-between'>
                <h3 className='text-[#4A4B4D] text-[20px] font-medium md:text-[16px]'>{category.name}</h3>
                <div className='relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px]'>
                  <Image
                    src={`/assets/${
                      selectedCategories.includes(category._id) ? "check_box_checked" : "check_box_empty"
                    }.png`}
                    alt=''
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
