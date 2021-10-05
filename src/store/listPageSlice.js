import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pageNum: 1,
    pageSize: 10,
    sortBy: null,
    sortDir: 'asc',
    filters: {},
};

export const listPageSlice = createSlice({
    name: 'listPage',
    initialState,
    reducers: {
        changePage: (state, { payload }) => {
            state.pageNum = payload.pageNum;
            state.pageSize = payload.pageSize;
        },
        sortPage: (state, { payload }) => {
            state.pageNum = initialState.pageNum;
            state.sortBy = payload.sortBy;
            state.sortDir = payload.sortDir;
        },
        clearPageState: () => initialState
    },
});

export const { changePage, sortPage, clearPageState } = listPageSlice.actions;
export default listPageSlice.reducer;
