import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./features/ProductSlice";
import blogSlice from "./features/blogSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: ProductSlice,
      blog: blogSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
