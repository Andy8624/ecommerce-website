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
        phone: "",
        imageUrl: "",
        birthdate: "",
        gender: "",
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
            state.user.email = action.payload?.email;
            state.user.fullName = action.payload?.fullName;
            state.user.phone = action.payload?.phone;
            state.user.imageUrl = action.payload?.imageUrl;
            state.user.birthdate = action.payload?.birthdate;
            state.user.gender = action.payload?.gender;
            state.user.cartId = action.payload?.cartId;
            state.user.role = action.payload?.role;

            state.user.role.permissions = action?.payload?.role?.permissions ?? [];
        },
        setLogoutUser: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                id: "",
                email: "",
                fullName: "",
                phone: "",
                imageUrl: "",
                birthdate: "",
                gender: "",
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

                const userData = action.payload.user ?? {}; // Đảm bảo user luôn có giá trị
                state.user.id = userData.id || "";
                state.user.email = userData.email || "";
                state.user.fullName = userData.fullName || "";
                state.user.phone = userData.phone || "";
                state.user.imageUrl = userData.imageUrl || "";
                state.user.birthdate = userData.birthdate || "";
                state.user.gender = userData.gender || "";
                state.user.cartId = userData.cartId || "";

                state.user.role = userData.role ?? { id: "", name: "", permissions: [] }; // Đảm bảo role không bị undefined
                state.user.role.permissions = userData.role?.permissions ?? [];
            }
        });

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