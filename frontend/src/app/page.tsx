"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetRecentBlogs } from "@/lib/features/blogSlice";
import { fetchGetRecentProducts } from "@/lib/features/ProductSlice";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, NotebookPen, Package2 } from "lucide-react";
import { fetchGetCount } from "@/lib/features/baseSlice";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const getCount = useSelector((state: RootState) => state.base.getCount.data);
  const getCountStatus = useSelector(
    (state: RootState) => state.base.getCountStatus
  );

  useEffect(() => {
    dispatch(fetchGetCount());
  }, []);
  return (
    <>
      {getCountStatus === "loading" ? (
        <p>Loading</p>
      ) : getCountStatus === "failed" ? (
        <p>Error</p>
      ) : getCountStatus == "succeeded" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-[90%]">
          <div className="flex flex-col space-y-4 p-4 rounded-md border">
            <h2 className="text-base md:text-xl font-semibold">
              Total Products
            </h2>
            <div className="flex justify-between space-x-2">
              <Package2 />
              <span className="text-base md:text-xl font-semibold text-center">
                {getCount.productCount}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-4 p-4 rounded-md border">
            <h2 className="text-base md:text-xl font-semibold">
              Total Categories
            </h2>
            <div className="flex justify-between space-x-2">
              <LayoutGrid />
              <span className="text-base md:text-xl font-semibold text-center">
                {getCount.categoryCount}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-4 p-4 rounded-md border">
            <h2 className="text-base md:text-xl font-semibold">Total Blogs</h2>
            <div className="flex justify-between space-x-2">
              <NotebookPen />
              <span className="text-base md:text-xl font-semibold text-center">
                {getCount.blogCount}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
