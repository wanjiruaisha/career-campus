import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/authSlice";
import articleReducer from "@/store/articleSlice";
import bookmarkReducer from "@/store/bookmarkSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    bookmarks: bookmarkReducer,
  },
});