"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllBlogs } from "@/lib/features/blogSlice";
import { useLayoutEffect } from "react";
import Link from "next/link";

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
        <>
          {getAllBlogs.length === 0 ? (
            <h2 className="text-lg md:text-2xl font-semibold">
              There is no product to show
            </h2>
          ) : (
            <div className="w-full md:w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {getAllBlogs.map((item) => (
                <div
                  key={item._id}
                  className="min-h-56 rounded-md bg-card grid gap-2 border "
                >
                  <Link href={`/blog/${item._id}`}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full rounded-t-md"
                    />
                  </Link>
                  <Link href={`/blog/${item._id}`} className="p-2">
                    <h2 className="text-base md:text-lg font-semibold line-clamp-1 hover:underline">
                      {item.title}
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default page;
