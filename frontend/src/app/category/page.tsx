"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllCategories } from "@/lib/features/categorySlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

function Category() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );

  const getAllCategoriesStatus = useSelector(
    (state: RootState) => state.category.getAllCategoriesStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllCategories());
  }, []);
  return (
    <>
      {getAllCategoriesStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllCategoriesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesStatus === "succeeded" ? (
        <div className="w-full md:w-[95%] grid gap-6">
          <h2 className="text-lg md:text-2xl font-semibold">All Categories</h2>
          <DataTable columns={columns} data={categories} />
        </div>
      ) : null}
    </>
  );
}

export default Category;
