import { useNavigate } from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();
    return (
        <div
            className="text-3xl font-bold cursor-pointer hover:scale-105 glowing-text"
            onClick={() => navigate('/')}
        >
            EduMall
        </div>
    );
};

export default Logo;
