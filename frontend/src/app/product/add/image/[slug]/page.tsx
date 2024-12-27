"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  fetchAddMoreImagesToProduct,
  fetchGetProduct,
} from "@/lib/features/ProductSlice";

const addMoreImageToProductSchema = z
  .object({
    images: z.array(
      z.any().refine((file) => file instanceof File, {
        message: "Images are required.",
      })
    ),
  })
  .refine((data) => data.images.length > 0, {
    message: "Please select at least one image.",
    path: ["images"],
  })
  .refine((data) => data.images.length <= 5, {
    message: "You can upload a maximum of 5 images.",
    path: ["images"],
  })
  .refine(
    (data) => {
      const imageTypes = data.images.map((image) => image.type);
      return imageTypes.every(
        (type) => type === "image/jpeg" || type === "image/png"
      );
    },
    {
      message: "Only .jpg and .png formats are supported.",
      path: ["images"],
    }
  )
  .refine(
    (data) => {
      const imageSizes = data.images.map((image) => image.size);
      return imageSizes.every((size) => size <= 3 * 1024 * 1024);
    },
    {
      message: "Images size should be less than 3MB.",
      path: ["images"],
    }
  );
function AddMoreImagesToProducts({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();

  const getProduct = useSelector(
    (state: RootState) => state.product.getProduct.data
  );

  const getProductStatus = useSelector(
    (state: RootState) => state.product.getProductStatus
  );

  useEffect(() => {
    dispatch(fetchGetProduct(params.slug));
  }, [dispatch, params.slug]);

  const form = useForm<z.infer<typeof addMoreImageToProductSchema>>({
    resolver: zodResolver(addMoreImageToProductSchema),
    defaultValues: {
      images: [],
    },
  });

  function onSubmit(values: z.infer<typeof addMoreImageToProductSchema>) {
    const formData = new FormData();

    values.images.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("_id", getProduct?._id || "");

    const addMoreImagesPromise = dispatch(
      fetchAddMoreImagesToProduct(formData)
    ).unwrap();
    toast.promise(addMoreImagesPromise, {
      loading: "Adding images...",
      success: (data) => {
        return data.message || "Images added successfully";
      },
      error: (error) => {
        return (
          error.message ||
          error ||
          "Something went wrong while adding images to product"
        );
      },
    });
  }
  return (
    <>
      {getProductStatus === "loading" ? (
        <p>Loading...</p>
      ) : getProductStatus === "failed" ? (
        <p>Error</p>
      ) : getProductStatus === "succeeded" ? (
        <Card>
          <CardHeader>
            <CardTitle>Add more images to product</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <h3>
              <strong>Product Name:</strong> {getProduct.name}
            </h3>
            <h3>
              <strong>Thumbnail:</strong>
            </h3>
            <img
              src={getProduct.thumbnail}
              alt={getProduct.name}
              className="w-44 h-44 object-cover rounded-md"
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          name="images"
                          multiple
                          accept="image/jpeg, image/png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button size="sm" className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

export default AddMoreImagesToProducts;
