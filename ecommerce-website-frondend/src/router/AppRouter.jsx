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
import ProductDetailPage from "../pages/ProductDetailPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAccount } from "../redux/slices/accountSlice";
import AdminHome from "../pages/AdminHome";
import ProtectedRoute from "../utils/ProtectRoute";
import Cart from "../pages/Cart";
import CheckoutPage from "../pages/Checkout";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import ToolPage from "../pages/ToolPage";
import SellerHome from "../pages/SellerHome"
import ProductManagement from "../features/seller/components/ProductManagement";
import OrderManagement from "../features/seller/components/OrderManagement";
import CourseManagement from "../features/seller/components/CourseManagement";
import Statistics from "../features/seller/components/Statistics";
import CoursePage from "../pages/CoursePage";
import CourseDetail from "../features/courses/components/CourseDetail";
import OnlinePayment from "../features/checkout/Components/OnlinePayment";
const router = createBrowserRouter([
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
                path: "products",
                element: <ToolPage />,
            },
            {
                path: "courses",
                element: <CoursePage />,
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
                path: "online-payment",
                element: <OnlinePayment />
            },
            {
                path: "order-history",
                element: <OrderHistoryPage />,
            },
            {
                path: "tool/:toolId",
                element: <ProductDetailPage />,
            },
            {
                path: "course-detail",
                element: <CourseDetail />
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
                element: <ProductManagement />
            },
            {
                path: "orders",
                element: <OrderManagement />
            },
            {
                path: "courses",
                element: <CourseManagement />,
            },
            {
                path: "statistics",
                element: <Statistics />,
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
    }

])

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

    return <RouterProvider router={router} />;
}
export default AppRouter;