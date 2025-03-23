import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    imageSearchResults: null,
    searchLoading: false, // Thêm trạng thái loading
    searchError: null, // Thêm trạng thái error
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setImageSearchResults: (state, action) => {
            state.imageSearchResults = action.payload;
            state.searchLoading = false;
            state.searchError = null;
        },
        startImageSearch: (state) => {
            state.searchLoading = true;
            state.searchError = null;
        },
        setImageSearchError: (state, action) => {
            state.searchLoading = false;
            state.searchError = action.payload;
        }
    }
});

export const { setImageSearchResults, startImageSearch, setImageSearchError } = searchSlice.actions;
export default searchSlice.reducer;
