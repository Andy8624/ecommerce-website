import { useSelector } from "react-redux";

const WellcomeHeader = () => {
    const { user } = useSelector(state => state?.account);
    // console.log(user);

    return (
        <h2 className="text-black text-2xl font-bold">
            Chào mừng bạn trở lại! {user?.fullName}
            <br />
            <span className="text-lg font-medium text-gray-600 italic">Chúc bạn có một ngày tuyệt vời! ✨</span>
        </h2>
    )
}

export default WellcomeHeader