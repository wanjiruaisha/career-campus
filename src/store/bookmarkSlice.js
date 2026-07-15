import { createSlice } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: {
    bookmarks: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default bookmarkSlice.reducer;