import { Outlet } from "react-router-dom"

const Auth = () => {
    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <Outlet />
                </div >
            </div >
        </div>
    )
}

export default Auth