import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '../services/userService';

const initialState = {
    name: '',
    username: '',
    email: '',
    isAdmin: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};

export const login = createAsyncThunk(
    'user/login',
    async (data, thunkAPI) => (
        userService.login(data)
            .then(
                (response) => {
                    console.log('response', response);
                    // localStorage.setItem('token', data);
                    return response.data;
                },
                (error) => thunkAPI.rejectWithValue(error.data)
            )
    ),
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.name = payload.name;
                state.username = payload.username;
                state.email = payload.email;
                state.isAdmin = payload.isAdmin;
                state.isFetching = false;
                state.isSuccess = true;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.isFetching = false;
                state.isError = true;
                state.errorMessage = payload.message;
            });
    },
});

export const selectUserStatus = (state) => ({
    isFetching: state.user.isFetching,
    isSuccess: state.user.isSuccess,
    isError: state.user.isError,
    errorMessage: state.user.errorMessage,
});


export const { clearState } = userSlice.actions;
export default userSlice.reducer;
