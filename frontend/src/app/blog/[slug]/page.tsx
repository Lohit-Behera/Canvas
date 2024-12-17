"use client";

import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetBlog } from "@/lib/features/blogSlice";

function page({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const getBlog = useSelector((state: RootState) => state.blog.getBlog.data);

  const getBlogStatus = useSelector(
    (state: RootState) => state.blog.getBlogStatus
  );
  useLayoutEffect(() => {
    dispatch(fetchGetBlog(params.slug));
  }, [params.slug]);
  return (
    <>
      {getBlogStatus === "loading" ? (
        <p>Loading</p>
      ) : getBlogStatus === "failed" ? (
        <p>Error</p>
      ) : getBlogStatus === "succeeded" ? (
        <div className="w-full md:w-[95%] grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={getBlog.thumbnail}
            alt={getBlog.title}
            className="w-full rounded-md"
          />
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg md:text-2xl font-semibold">
              {getBlog.title}
            </h2>
            <p className="text-sm text-muted-foreground">{getBlog.content}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default page;
