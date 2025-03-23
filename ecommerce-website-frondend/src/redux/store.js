import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import imageSearchReducer from "./slices/imageSearchSlice";


export const store = configureStore({
  reducer: {
    account: accountReducer,
    search: imageSearchReducer,
  },
});


