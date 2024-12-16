import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// types
type CreateProduct = {
  name: string;
  description: string;
  affiliateLink: string;
  price: number;
  category: string;
  quantity: number;
  image: File;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  affiliateLink: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// fetch functions
export const fetchCreateProduct = createAsyncThunk(
  "product/createProduct",
  async (product: CreateProduct, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/products/create`,
        product,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetProduct = createAsyncThunk(
  "product/getProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/v1/products/${productId}`
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    createProduct: { data: "" },
    createProductStatus: "idle",
    createProductError: {},

    getProduct: { data: {} as Product },
    getProductStatus: "idle",
    getProductError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Product
      .addCase(fetchCreateProduct.pending, (state) => {
        state.createProductStatus = "loading";
      })
      .addCase(fetchCreateProduct.fulfilled, (state, action) => {
        state.createProductStatus = "succeeded";
        state.createProduct = action.payload;
      })
      .addCase(fetchCreateProduct.rejected, (state, action) => {
        state.createProductStatus = "failed";
        state.createProductError = action.payload || "Failed to create product";
      })

      // Get Product
      .addCase(fetchGetProduct.pending, (state) => {
        state.getProductStatus = "loading";
      })
      .addCase(fetchGetProduct.fulfilled, (state, action) => {
        state.getProductStatus = "succeeded";
        state.getProduct = action.payload;
      })
      .addCase(fetchGetProduct.rejected, (state, action) => {
        state.getProductStatus = "failed";
        state.getProductError = action.payload || "Failed to get product";
      });
  },
});

export default productSlice.reducer;
