"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCreateProduct } from "@/lib/features/ProductSlice";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";
import { fetchGetAllCategoriesNames } from "@/lib/features/categorySlice";

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  affiliateLink: z
    .string()
    .url({ message: "Affiliate link must be a valid URL" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be at most 500 characters" }),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
  price: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(1, { message: "Amount must be at least 1" }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  quantity: z.number().positive({ message: "Price must be a positive number" }),
});

function page() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const getAllCategoriesNames = useSelector(
    (state: RootState) => state.category.getAllCategoriesNames.data
  );

  const getAllCategoriesNamesStatus = useSelector(
    (state: RootState) => state.category.getAllCategoriesNamesStatus
  );

  useEffect(() => {
    if (getAllCategoriesNames.length === 0) {
      dispatch(fetchGetAllCategoriesNames());
    }
  });
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      affiliateLink: "",
      price: 0,
      category: "",
      quantity: 0,
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof createProductSchema>) {
    const createProductPromise = dispatch(fetchCreateProduct(values)).unwrap();
    toast.promise(createProductPromise, {
      loading: "Creating product...",
      success: (data) => {
        router.push(`/product/${data.data}`);
        return data.message || "Product created successfully";
      },
      error: (error) => {
        return (
          error.message ||
          error ||
          "Something went wrong while creating the product"
        );
      },
    });
  }
  return (
    <>
      {getAllCategoriesNamesStatus === "loading" ? (
        <p>Loading...</p>
      ) : getAllCategoriesNamesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesNamesStatus === "succeeded" ? (
        <Card className="w-full md:w-[95%] lg:w-[90%]">
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Product description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliateLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiliate Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Affiliate link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAllCategoriesNames.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          placeholder="Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default page;
