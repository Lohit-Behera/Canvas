"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllProducts } from "@/lib/features/ProductSlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

function Product() {
  const dispatch = useDispatch<AppDispatch>();
  const getAllProducts = useSelector(
    (state: RootState) => state.product.getAllProducts.data
  );
  const getAllProductsStatus = useSelector(
    (state: RootState) => state.product.getAllProductsStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllProducts());
  }, []);

  return (
    <>
      {getAllProductsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllProductsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllProductsStatus === "succeeded" ? (
        <div className="w-full md:w-[95%]">
          <DataTable columns={columns} data={getAllProducts} />
        </div>
      ) : null}
    </>
  );
}

export default Product;
