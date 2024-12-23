import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// api call
export const fetchCreateCategory = createAsyncThunk(
  "category/createCategory",
  async (
    category: { name: string; thumbnail: File; isPublic: boolean },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/categories/create`,
        category,
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

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/categories/get/all`,
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

export const getAllCategoriesNames = createAsyncThunk(
  "category/getAllCategoriesNames",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/categories/get/names`,
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    createCategory: {},
    createCategoryStatus: "idle",
    createCategoryError: {},

    getAllCategories: {},
    getAllCategoriesStatus: "idle",
    getAllCategoriesError: {},

    getAllCategoriesNames: {},
    getAllCategoriesNamesStatus: "idle",
    getAllCategoriesNamesError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create category
      .addCase(fetchCreateCategory.pending, (state) => {
        state.createCategoryStatus = "loading";
      })
      .addCase(fetchCreateCategory.fulfilled, (state, action) => {
        state.createCategoryStatus = "succeeded";
        state.createCategory = action.payload;
      })
      .addCase(fetchCreateCategory.rejected, (state, action) => {
        state.createCategoryStatus = "failed";
        state.createCategoryError =
          action.payload || "Failed to create category";
      })
      // get all categories
      .addCase(getAllCategories.pending, (state) => {
        state.getAllCategoriesStatus = "loading";
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesStatus = "succeeded";
        state.getAllCategories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.getAllCategoriesStatus = "failed";
        state.getAllCategoriesError =
          action.payload || "Failed to get categories";
      })

      // get all categories names
      .addCase(getAllCategoriesNames.pending, (state) => {
        state.getAllCategoriesNamesStatus = "loading";
      })
      .addCase(getAllCategoriesNames.fulfilled, (state, action) => {
        state.getAllCategoriesNamesStatus = "succeeded";
        state.getAllCategoriesNames = action.payload;
      })
      .addCase(getAllCategoriesNames.rejected, (state, action) => {
        state.getAllCategoriesNamesStatus = "failed";
        state.getAllCategoriesNamesError =
          action.payload || "Failed to get categories names";
      });
  },
});

export default categorySlice.reducer;
