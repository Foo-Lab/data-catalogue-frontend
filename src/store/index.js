import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import listPageReducer from './listPageSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        listPage: listPageReducer,
    },
});

export default store;
