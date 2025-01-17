import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// types
type CreateProduct = {
  name: string;
  productDescription?: string;
  productDetail: string;
  affiliateLink: string;
  amount: number;
  discount: number;
  sellingPrice: number;
  category: string;
  quantity: number;
  thumbnail: File;
  isPublic: boolean;
  bigImage: File;
};

type Product = {
  _id: string;
  name: string;
  productDescription: string;
  productDetail: string;
  affiliateLink: string;
  category: string;
  thumbnail: string;
  bigImage: string;
  quantity: number;
  amount: number;
  discount: number;
  sellingPrice: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AllProductType = {
  _id: string;
  name: string;
  category: string;
  thumbnail: string;
  amount: string;
  discount: string;
  sellingPrice: string;
  isPublic: string;
};

type UpdateProduct = {
  _id: string;
  name?: string;
  productDescription?: string;
  productDetail?: string;
  affiliateLink?: string;
  category?: string;
  quantity?: number;
  amount?: number;
  discount?: number;
  sellingPrice?: number;
  isPublic?: boolean;
  thumbnail?: File;
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

export const fetchGetAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/products/get/all`);
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

export const fetchGetRecentProducts = createAsyncThunk(
  "product/getRecentProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/products/get/recent`);
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

export const fetchUpdateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product: UpdateProduct, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/products/update/${product._id}`,
        {
          name: product.name,
          productDescription: product.productDescription,
          productDetail: product.productDetail,
          affiliateLink: product.affiliateLink,
          category: product.category,
          quantity: product.quantity,
          amount: product.amount,
          discount: product.discount,
          sellingPrice: product.sellingPrice,
          isPublic: product.isPublic,
          thumbnail: product.thumbnail,
        },
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

    getAllProducts: { data: [] as AllProductType[] },
    getAllProductsStatus: "idle",
    getAllProductsError: {},

    getRecentProducts: { data: [] as AllProductType[] },
    getRecentProductsStatus: "idle",
    getRecentProductsError: {},

    updateProduct: { data: "" },
    updateProductStatus: "idle",
    updateProductError: {},
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
      })

      // Get All Products
      .addCase(fetchGetAllProducts.pending, (state) => {
        state.getAllProductsStatus = "loading";
      })
      .addCase(fetchGetAllProducts.fulfilled, (state, action) => {
        state.getAllProductsStatus = "succeeded";
        state.getAllProducts = action.payload;
      })
      .addCase(fetchGetAllProducts.rejected, (state, action) => {
        state.getAllProductsStatus = "failed";
        state.getAllProductsError = action.payload || "Failed to get products";
      })

      // Get Recent Products
      .addCase(fetchGetRecentProducts.pending, (state) => {
        state.getRecentProductsStatus = "loading";
      })
      .addCase(fetchGetRecentProducts.fulfilled, (state, action) => {
        state.getRecentProductsStatus = "succeeded";
        state.getRecentProducts = action.payload;
      })
      .addCase(fetchGetRecentProducts.rejected, (state, action) => {
        state.getRecentProductsStatus = "failed";
        state.getRecentProductsError =
          action.payload || "Failed to get recent products";
      })

      // Update Product
      .addCase(fetchUpdateProduct.pending, (state) => {
        state.updateProductStatus = "loading";
      })
      .addCase(fetchUpdateProduct.fulfilled, (state, action) => {
        state.updateProductStatus = "succeeded";
        state.updateProduct = action.payload;
      })
      .addCase(fetchUpdateProduct.rejected, (state, action) => {
        state.updateProductStatus = "failed";
        state.updateProductError = action.payload || "Failed to update product";
      });
  },
});

export default productSlice.reducer;
