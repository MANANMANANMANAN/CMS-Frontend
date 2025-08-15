import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/dashboard";
import { courseReducer } from "./Reducers/dashboard";
const store = configureStore({
    reducer: {
      user: userReducer,
      course : courseReducer
    },
  });
export default store;