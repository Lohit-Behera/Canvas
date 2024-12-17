"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllProducts } from "@/lib/features/ProductSlice";
import { useLayoutEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function page() {
  const dispatch = useDispatch<AppDispatch>();
  const getAllProducts = useSelector(
    (state: RootState) => state.product.getAllProducts.data
  );
  const getAllProductsStatus = useSelector(
    (state: RootState) => state.product.getAllProductsStatus
  );
  useLayoutEffect(() => {
    dispatch(fetchGetAllProducts());
  }, []);

  return (
    <>
      {getAllProductsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllProductsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllProductsStatus === "succeeded" ? (
        <>
          {getAllProducts.length === 0 ? (
            <h2 className="text-lg md:text-2xl font-semibold">
              There is no product to show
            </h2>
          ) : (
            <div className="w-full md:w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {getAllProducts.map((item) => (
                <div
                  key={item._id}
                  className="min-h-56 rounded-lg bg-card grid gap-2 border "
                >
                  <div className="w-full h-44 overflow-hidden">
                    <Link href={`/product/${item._id}`}>
                      <Image
                        className="w-full h-full object-cover rounded-t-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                        src={item.image}
                        alt={item.name}
                      />
                    </Link>
                  </div>
                  <div className="grid gap-2 p-2">
                    <div className="grid">
                      <Link href={`/product/${item._id}`}>
                        <h3 className="text-base md:text-lg font-semibold line-clamp-1 hover:underline">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">
                      Price: {item.price}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => window.open(item.affiliateLink, "_blank")}
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
    </>
  );
}

export default page;
