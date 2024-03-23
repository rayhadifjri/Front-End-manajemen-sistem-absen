import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email,
            password: user.password
        })
        return response.data
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg
            return thunkAPI.rejectWithValue(message)
        }
    }
});

export const GetwhoAmI = createAsyncThunk("user/GetwhoAmI", async (_, thunkAPI) => {
    try {
        const response = await axios.get("http://localhost:5000/refreshToken");
        const decoded = jwtDecode(response.data.accessToken || ''); // Use an empty string if the token is not defined
        response.data = decoded; // Set response.data to the decoded token data
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg
            return thunkAPI.rejectWithValue(message);
        }
        return thunkAPI.rejectWithValue("Terjadi kesalahan saat melakukan permintaan");
    }
});


export const Logout = createAsyncThunk("user/Logout", async () => {
    await axios.delete('http://localhost:5000/logout')
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        //GetMe
        builder.addCase(GetwhoAmI.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(GetwhoAmI.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(GetwhoAmI.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;