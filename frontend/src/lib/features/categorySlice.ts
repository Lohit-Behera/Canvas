import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// types
export type Category = {
  _id: string;
  name: string;
  thumbnail: string;
  isPublic: boolean;
};

type AllCategories = {
  docs: Category[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

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

export const fetchGetAllCategories = createAsyncThunk(
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

export const fetchGetAllCategoriesNames = createAsyncThunk(
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

export const fetchGetCategory = createAsyncThunk(
  "category/getCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/categories/get/${categoryId}`,
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

export const fetchUpdateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    category: {
      _id: string;
      name?: string;
      thumbnail?: File;
      isPublic: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/categories/update/${category._id}`,
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    createCategory: {},
    createCategoryStatus: "idle",
    createCategoryError: {},

    getAllCategories: { data: [] as Category[] },
    getAllCategoriesStatus: "idle",
    getAllCategoriesError: {},

    getAllCategoriesNames: { data: [] as { name: string; _id: string }[] },
    getAllCategoriesNamesStatus: "idle",
    getAllCategoriesNamesError: {},

    getCategory: { data: {} as Category },
    getCategoryStatus: "idle",
    getCategoryError: {},

    updateCategory: { data: "" },
    updateCategoryStatus: "idle",
    updateCategoryError: {},
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
      .addCase(fetchGetAllCategories.pending, (state) => {
        state.getAllCategoriesStatus = "loading";
      })
      .addCase(fetchGetAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesStatus = "succeeded";
        state.getAllCategories = action.payload;
      })
      .addCase(fetchGetAllCategories.rejected, (state, action) => {
        state.getAllCategoriesStatus = "failed";
        state.getAllCategoriesError =
          action.payload || "Failed to get categories";
      })

      // get all categories names
      .addCase(fetchGetAllCategoriesNames.pending, (state) => {
        state.getAllCategoriesNamesStatus = "loading";
      })
      .addCase(fetchGetAllCategoriesNames.fulfilled, (state, action) => {
        state.getAllCategoriesNamesStatus = "succeeded";
        state.getAllCategoriesNames = action.payload;
      })
      .addCase(fetchGetAllCategoriesNames.rejected, (state, action) => {
        state.getAllCategoriesNamesStatus = "failed";
        state.getAllCategoriesNamesError =
          action.payload || "Failed to get categories names";
      })

      // get category
      .addCase(fetchGetCategory.pending, (state) => {
        state.getCategoryStatus = "loading";
      })
      .addCase(fetchGetCategory.fulfilled, (state, action) => {
        state.getCategoryStatus = "succeeded";
        state.getCategory = action.payload;
      })
      .addCase(fetchGetCategory.rejected, (state, action) => {
        state.getCategoryStatus = "failed";
        state.getCategoryError = action.payload || "Failed to get category";
      })

      // update category
      .addCase(fetchUpdateCategory.pending, (state) => {
        state.updateCategoryStatus = "loading";
      })
      .addCase(fetchUpdateCategory.fulfilled, (state, action) => {
        state.updateCategoryStatus = "succeeded";
        state.updateCategory = action.payload;
      })
      .addCase(fetchUpdateCategory.rejected, (state, action) => {
        state.updateCategoryStatus = "failed";
        state.updateCategoryError =
          action.payload || "Failed to update category";
      });
  },
});

export default categorySlice.reducer;
