import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    name: "",
  },
  reducers: {},
});

export default productSlice.reducer;
