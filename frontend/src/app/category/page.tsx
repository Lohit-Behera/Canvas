"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchGetAllCategories } from "@/lib/features/categorySlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function page() {
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
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.docs.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <img
                      src={category.thumbnail}
                      alt={category.name}
                      className="w-20 h-20 rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    {category.isPublic ? "Public" : "Private"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </>
  );
}

export default page;
