import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAccount } from '../../services/AuthService';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        id: "",
        email: "",
        fullName: "",
        cartId: "",
        role: {
            id: "",
            name: "",
            permissions: [],
        },
    },
};

export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => { // Nếu hàm có trạng thái fulfilled thì kết quả sẽ được truyền vào action.payload
        const response = await getAccount();
        return response.data;
    }
)


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setLoginUserInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id;
            state.user.email = action.payload.email;
            state.user.fullName = action.payload.fullName;
            state.user.cartId = action.payload.cartId;
            state.user.role = action.payload.role;

            state.user.role.permissions = action?.payload?.role?.permissions ?? [];
        },
        setLogoutUser: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                id: "",
                email: "",
                fullName: "",
                cartId: "",
                role: {
                    id: "",
                    name: "",
                    permissions: [],
                },
            }
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = true;
            }
        })

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.id = action?.payload?.user?.id;
                state.user.email = action.payload.user?.email;
                state.user.fullName = action.payload.user?.fullName;
                state.user.cartId = action.payload.user?.cartId;
                state.user.role = action.payload.user?.role;
                state.user.role.permissions = action?.payload?.user?.role?.permissions ?? [];
            }
        })

        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        })

    },

});

export const { setLoginUserInfo, setLogoutUser, setRefreshTokenAction } = accountSlice.actions;
export default accountSlice.reducer;