import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default articleSlice.reducer;