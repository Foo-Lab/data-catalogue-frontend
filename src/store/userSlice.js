import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '../services/userService';

const initialState = {
    userId: '',
    name: '',
    token: '',
    // username: '',
    // email: '',
    isLoggedIn: false,
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
                    console.log('response', response.data);
                    // localStorage.setItem('token', JSON.stringify(response.data));

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
        refreshUser: (state, { payload }) => {
            state.userId = payload.id;
            state.name = payload.name;
            state.token = payload.token;
            state.isAdmin = payload.isAdmin;
            state.isFetching = false;
            state.isLoggedIn = true;
            state.isSuccess = true;
        },
        logout: (state) => {
            state.userId = '';
            state.name = '';
            state.token = '';
            // state.username = '';
            // state.email = '';
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.isFetching = false;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = '';
        },
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
                state.userId = payload.id;
                state.name = payload.name;
                state.token = payload.token;
                // state.username = payload.username;
                // state.email = payload.email;
                state.isAdmin = payload.isAdmin;
                state.isFetching = false;
                state.isLoggedIn = true;
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
    isLoggedIn: state.user.isLoggedIn,
    isError: state.user.isError,
    errorMessage: state.user.errorMessage,
});

export const selectUserInfo = (state) => ({
    userId: state.user.userId,
    name: state.user.name,
    token: state.user.token,
    // username: state.user.username,
    // email: state.user.email,
    isAdmin: state.user.isAdmin,
    isLoggedIn: state.user.isLoggedIn,
})


export const { clearState, logout, refreshUser } = userSlice.actions;
export default userSlice.reducer;
