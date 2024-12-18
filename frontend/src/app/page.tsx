"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetRecentBlogs } from "@/lib/features/blogSlice";
import { fetchGetRecentProducts } from "@/lib/features/ProductSlice";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const getRecentBlogs = useSelector(
    (state: RootState) => state.blog.getRecentBlogs.data
  );
  const getRecentBlogsStatus = useSelector(
    (state: RootState) => state.blog.getRecentBlogsStatus
  );
  const getRecentProducts = useSelector(
    (state: RootState) => state.product.getRecentProducts.data
  );
  const getRecentProductsStatus = useSelector(
    (state: RootState) => state.product.getRecentProductsStatus
  );

  useEffect(() => {
    if (getRecentProducts.length === 0) {
      dispatch(fetchGetRecentProducts());
    }
    if (getRecentBlogs.length === 0) {
      dispatch(fetchGetRecentBlogs());
    }
  }, []);
  return (
    <div className="grid gap-6 w-full md:w-[95%]">
      <div className="grid gap-2">
        <div className="flex justify-between">
          <h3 className="text-base md:text-lg font-semibold">
            Recent Products
          </h3>
          <Link
            href="/product"
            className="text-sm text-muted-foreground hover:underline"
          >
            See All
          </Link>
        </div>
        {getRecentProductsStatus === "loading" ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : getRecentProductsStatus === "failed" ? (
          <p className="text-sm text-muted-foreground">Server Error</p>
        ) : getRecentBlogsStatus === "succeeded" ? (
          <>
            {getRecentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent products
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getRecentProducts.map((item) => (
                  <div
                    key={item._id}
                    className="min-h-56 rounded-lg bg-card grid gap-2 border "
                  >
                    <Link href={`/product/${item._id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-44 object-cover rounded-t-md"
                      />
                    </Link>
                    <div className="grid gap-2 p-2">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-base md:text-lg line-clamp-1 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          window.open(item.affiliateLink, "_blank")
                        }
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between">
          <h3 className="text-base md:text-lg font-semibold">Recent Blogs</h3>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:underline"
          >
            See All
          </Link>
        </div>
        {getRecentBlogsStatus === "loading" ? (
          <p className="text-sm text-muted-foreground">Server Error</p>
        ) : getRecentBlogsStatus === "failed" ? (
          <p className="text-sm text-muted-foreground">Server Error</p>
        ) : getRecentBlogsStatus === "succeeded" ? (
          <>
            {getRecentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent blogs</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getRecentBlogs.map((item) => (
                  <div
                    key={item._id}
                    className="min-h-56 rounded-lg bg-card grid gap-2 border "
                  >
                    <Link href={`/blog/${item._id}`}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-44 object-cover rounded-t-md"
                      />
                    </Link>
                    <Link href={`/blog/${item._id}`} className="p-2">
                      <h3 className="text-base md:text-lg line-clamp-1 hover:underline">
                        {item.title}
                      </h3>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
