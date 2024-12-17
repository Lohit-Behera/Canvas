"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetProduct } from "@/lib/features/ProductSlice";
import { useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";

function page({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();

  const getProduct = useSelector(
    (state: RootState) => state.product.getProduct.data
  );
  const getProductStatus = useSelector(
    (state: RootState) => state.product.getProductStatus
  );

  useLayoutEffect(() => {
    dispatch(fetchGetProduct(params.slug));
  }, [params.slug]);
  return (
    <>
      {getProductStatus === "loading" ? (
        <div>Loading...</div>
      ) : getProductStatus === "failed" ? (
        <div>Server Error</div>
      ) : getProductStatus === "succeeded" ? (
        <div className="w-full md:w-[95%] grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={getProduct.image}
            alt={getProduct.name}
            className="rounded-md"
          />
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg md:text-2xl font-semibold">
                {getProduct.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {getProduct.description}
              </p>
            </div>
            <h3 className="text-lg md:text-2xl font-semibold">
              Price: {getProduct.price}
            </h3>
            <Button
              className="font-semibold"
              size="sm"
              onClick={() => {
                window.open(getProduct.affiliateLink, "_blank");
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default page;
