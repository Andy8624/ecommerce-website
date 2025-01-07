import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotPermitted from "../pages/NotPermitted";
import Loading from "../components/Loading";

const RoleBaseRoute = ({ role, children }) => {
    const user = useSelector(state => state.account.user);
    const userRole = user.role.name;
    if (userRole === role) {
        return <>{children}</>;
    } else {
        return <NotPermitted />;
    }
}

const ProtectedRoute = ({ children, role }) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const isLoading = useSelector(state => state.account.isLoading);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                isAuthenticated ? (
                    <RoleBaseRoute role={role}>
                        {children}
                    </RoleBaseRoute>
                ) : (
                    <Navigate to='/auth/login' replace />
                )
            )}
        </>
    );
}

export default ProtectedRoute;
