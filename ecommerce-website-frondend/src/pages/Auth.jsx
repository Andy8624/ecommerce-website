import { Outlet } from "react-router-dom"

const Auth = () => {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Outlet />
        </div>
    )
}

export default Auth