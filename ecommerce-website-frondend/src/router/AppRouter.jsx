import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BuyerLayout from "../layouts/BuyerLayout";
import AdminLayout from "../layouts/AdminLayout";
import SellerLayout from "../layouts/SellerLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterForm from "../features/auth/components/RegisterForm";
import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import ProductOverviewPage from "../pages/ProductOverviewPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAccount } from "../redux/slices/accountSlice";
import AdminHome from "../pages/AdminHome";
import ProtectedRoute from "../utils/ProtectRoute";
import Cart from "../pages/Cart";
import CheckoutPage from "../pages/Checkout";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import SellerHome from "../pages/SellerHome"
import ProductManagement from "../features/seller/components/ProductManagement";
import OrderManagement from "../features/seller/components/OrderManagement";
import Statistics from "../features/seller/components/Statistics";
import Profile from "../pages/Profile";
import AddProductPage from "../pages/AddProductPage";
import RegisterSellerPage from "../pages/RegisterSellerPage";
import BecomeSellerPage from "../pages/BecomeSellerPage";
import BecomeSellerLayout from "../layouts/BecomeSellerLayout";
import ProductForm from "../features/seller/components/ProductForm";
import ChatPrivate from "../features/websocket-chat/components/ChatPrivate";
import SearchProductPage from "../pages/SearchProductPage";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <BuyerLayout />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    path: "",
                    element: <Home />,
                },
                {
                    path: "cart",
                    element: <Cart />,
                },
                {
                    path: "checkout",
                    element: <CheckoutPage />,
                },
                {
                    path: "order-history",
                    element: <OrderHistoryPage />,
                },
                {
                    path: "tool/:toolId",
                    element: <ProductOverviewPage />,
                },
                {
                    path: "profile",
                    element: <Profile />,
                },
                {
                    path: "result-search-image",
                    element: <SearchProductPage />,
                }
            ]
        },
        {
            path: "/admin",
            element:
                <ProtectedRoute role="SUPER_ADMIN">
                    <AdminLayout />
                </ProtectedRoute>
            ,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    path: "admin-home",
                    element:
                        <AdminHome />,
                },
            ]
        },
        {
            path: "/seller",
            element:
                <ProtectedRoute role="SELLER">
                    <SellerLayout />
                </ProtectedRoute>
            ,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    path: "",
                    element:
                        <SellerHome />,
                },
                {
                    path: "products",
                    element: <ProductManagement />,
                },
                {
                    path: "products/new",
                    element: <AddProductPage />
                },
                {
                    path: "orders",
                    element: <OrderManagement />
                },
                {
                    path: "statistics",
                    element: <Statistics />,
                },
                {
                    path: "product-form",
                    element: <ProductForm />
                }
            ]
        },
        {
            path: "/auth",
            element: <Auth />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    path: "login",
                    element: <LoginForm />,
                },
                {
                    path: "register",
                    element: <RegisterForm />,
                },
                {
                    path: "forgot-password",
                    element: <ForgotPasswordForm />,
                }
            ]
        },
        {
            path: "/become-seller",
            element: <BecomeSellerLayout />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    path: "accept",
                    element: <BecomeSellerPage />,
                },
                {
                    path: "register",
                    element: <RegisterSellerPage />,
                }
            ]
        },
        {
            path: "/chat",
            element: <ChatPrivate />,
        }

    ],
    { future: { v7_relativeSplatPath: true, } }
)

const AppRouter = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (
            window.location.pathname === '/auth/login'
            || window.location.pathname === '/auth/register'
            || window.location.pathname === '/auth/forgot-password'
        ) return;

        dispatch(fetchAccount())
    }, [dispatch])

    return <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
    />;
}
export default AppRouter;