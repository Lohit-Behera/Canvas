"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllBlogs } from "@/lib/features/blogSlice";
import { useLayoutEffect } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

function page() {
  const dispatch = useDispatch<AppDispatch>();

  const getAllBlogs = useSelector(
    (state: RootState) => state.blog.getAllBlogs.data
  );

  const getAllBlogsStatus = useSelector(
    (state: RootState) => state.blog.getAllBlogsStatus
  );

  useLayoutEffect(() => {
    if (getAllBlogs.length === 0) {
      dispatch(fetchGetAllBlogs());
    }
  }, []);
  return (
    <>
      {getAllBlogsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllBlogsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllBlogsStatus === "succeeded" ? (
        <div className="w-full md:w-[95%]">
          <DataTable columns={columns} data={getAllBlogs} filter="title" />
        </div>
      ) : null}
    </>
  );
}

export default page;
