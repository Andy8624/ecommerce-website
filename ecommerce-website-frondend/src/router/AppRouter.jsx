import { createBrowserRouter, Navigate, RouterProvider, ScrollRestoration } from "react-router-dom";
import BuyerLayout from "../layouts/BuyerLayout";
import AdminLayout from "../layouts/AdminLayout";
import SellerLayout from "../layouts/SellerLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
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
import SearchProductPage from "../pages/SearchProductPage";
import SimilarProductList from "../features/tools/components/SimilarProductList";
import AuthPage from '../features/auth/pages/AuthPage';
import SemanticSearchResults from "../features/tools/components/SemanticSearchResults";

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
                    element:
                        <>
                            <Home />
                            <ScrollRestoration />
                        </>
                },
                {
                    path: "cart",
                    element:
                        <>
                            <Cart />
                            <ScrollRestoration />
                        </>
                },
                {
                    path: "checkout",
                    element:
                        <>
                            <CheckoutPage />
                            <ScrollRestoration />
                        </>
                },
                {
                    path: "order-history",
                    element: <OrderHistoryPage />,
                },
                {
                    path: "tool/:toolId",
                    element:
                        <>
                            <ProductOverviewPage />
                            <ScrollRestoration />
                        </>
                },
                {
                    path: "profile",
                    element: <Profile />,
                },
                {
                    path: "result-search-image",
                    element: <SearchProductPage />,
                },
                {
                    path: "result-semantic-search",
                    element: <SemanticSearchResults />,
                },
                {
                    path: "similar-products/:toolId",
                    element:
                        <>
                            <SimilarProductList />
                            <ScrollRestoration />
                        </>
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
                    element: <AdminHome />,
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
                    element: <SellerHome />,
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
                },
                {
                    path: "product-form/:toolId",
                    element: <ProductForm />
                }
            ]
        },
        {
            path: "/auth",
            element: <Auth />,
            children: [
                { path: "login", element: <AuthPage /> },
                { path: "register", element: <AuthPage /> },
                { path: "forgot-password", element: <AuthPage /> },
                { path: "", element: <Navigate to="/auth/login" replace /> },
            ],
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
    ],
    { future: { v7_relativeSplatPath: true } }
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