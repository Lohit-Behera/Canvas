import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchCreateBlog = createAsyncThunk(
  "blog/createBlog",
  async (
    blog: { title: string; content: string; thumbnail: File },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/blogs/create`,
        blog,
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

export const fetchGetBlog = createAsyncThunk(
  "blog/getBlog",
  async (blogId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/blogs/get/${blogId}`);
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

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    createBlog: { data: "" },
    createBlogStatus: "idle",
    createBlogError: {},

    getBlog: { data: {} },
    getBlogStatus: "idle",
    getBlogError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(fetchCreateBlog.pending, (state) => {
        state.createBlogStatus = "loading";
      })
      .addCase(fetchCreateBlog.fulfilled, (state, action) => {
        state.createBlogStatus = "succeeded";
        state.createBlog.data = action.payload;
      })
      .addCase(fetchCreateBlog.rejected, (state, action) => {
        state.createBlogStatus = "failed";
        state.createBlogError = action.payload || "Failed to create blog";
      })
      // Get Blog
      .addCase(fetchGetBlog.pending, (state) => {
        state.getBlogStatus = "loading";
      })
      .addCase(fetchGetBlog.fulfilled, (state, action) => {
        state.getBlogStatus = "succeeded";
        state.getBlog.data = action.payload;
      });
  },
});

export default blogSlice.reducer;
