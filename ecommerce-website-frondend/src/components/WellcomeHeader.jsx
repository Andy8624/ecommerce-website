import { useSelector } from "react-redux";

const WellcomeHeader = () => {
    const { user } = useSelector(state => state?.account);
    // console.log(user);

    return (
        <div className="m-4 mb-4 mb-0 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <h2 className="text-black text-2xl font-bold">
                    Chào mừng bạn trở lại! {user?.fullName}
                    <br />
                    <span className="text-lg font-medium text-gray-600 italic">Chúc bạn có một ngày tuyệt vời! ✨</span>
                </h2>

            </div>
        </div>
    )
}

export default WellcomeHeader