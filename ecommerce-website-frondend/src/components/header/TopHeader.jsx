import { BiSupport } from "react-icons/bi";
import { FaFacebook, FaInstagram, FaRegBell } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetUserById } from "../../hooks/useGetUserById";
import { Avatar } from "antd";
import { AVT_URL } from "../../utils/Config";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import LoginModal from "../LoginModal";

const TopHeader = () => {
    const navigate = useNavigate();
    const email = useSelector(state => state.account?.user?.email);

    const userId = useSelector(state => state.account?.user?.id);
    const { getUserById } = useGetUserById(userId);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBecomeSeller = () => {
        navigate("/become-seller/accept");
    }


    const leftMenuItems = [
        {
            key: "seller",
            label: (
                <span className="flex items-center gap-2 soft-gold-text ">
                    {getUserById?.role?.name === "SELLER" ?
                        "Kênh người bán" :
                        "Trở thành người bán"
                    }
                </span>
            ),
            onClick: () => {
                if (userId == undefined || userId == null || userId == "") {
                    return setIsModalVisible(true);
                }
                if (getUserById?.role?.name === "BUYER") {
                    handleBecomeSeller();
                } else {
                    navigate("/seller");
                }

            },
        },
        {
            key: "app",
            label: <div className="soft-gold-text">Tải ứng dụng</div>,
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "connect",
            label: (
                <span className="flex items-center gap-2 soft-gold-text ">
                    Kết nối
                    <FaFacebook
                        className="text-white hover:text-blue-400 cursor-pointer"
                        onClick={() => window.open("https://www.facebook.com/khangduong.2803", "_blank")}
                    />
                    <FaInstagram
                        className="text-white hover:text-pink-500 cursor-pointer"
                        onClick={() => window.open("https://www.instagram.com/___khangss___/", "_blank")}
                    />
                </span>
            ),
            onClick: () => window.open("https://www.facebook.com/khangduong.2803", "_blank")
        },
    ];

    // Mảng menu bên phải
    const rightMenuItems = [
        {
            key: "notifications",
            label: (
                <span className="flex items-center gap-1 soft-gold-text ">
                    <FaRegBell className="text-[0.85rem]" />
                    Thông báo
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "support",
            label: (
                <span className="flex items-center gap-1 soft-gold-text ">
                    <BiSupport className="text-[0.85rem]" />
                    Hỗ trợ
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "language",
            label: (
                <span className="flex items-center gap-1 soft-gold-text ">
                    <GrLanguage className="text-[0.85rem]" />
                    Tiếng việt
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "user",
            label: (
                <span className="flex items-center gap-2 soft-gold-text ">
                    <Avatar
                        src={AVT_URL + getUserById?.imageUrl}
                        size={20}
                        icon={<UserOutlined />}
                    />
                    <span className="text-sm">{email}</span>
                </span>
            ),
            onClick: () => navigate("/profile")
        },
    ];

    return (
        <div
            className="flex justify-between items-center text-white px-[65px] mt-2 text-[0.85rem] fixed-header"
            style={{ backgroundColor: "var(--primary-color)", zIndex: "1001" }}
        >
            {/* Menu bên trái */}
            <div className="flex items-center gap-4">
                {leftMenuItems.map((item) => (
                    <span
                        key={item.key}
                        onClick={item.onClick}
                        className="hover:underline cursor-pointer whitespace-nowrap flex items-center gap-2"
                    >
                        {item.label}
                    </span>
                ))}
            </div>

            {/* Menu bên phải */}
            <div className="flex items-center gap-5">
                {rightMenuItems.map((item) => (
                    <span
                        key={item.key}
                        onClick={item.onClick}
                        className="hover:underline cursor-pointer whitespace-nowrap"
                    >
                        {item.label}
                    </span>
                ))}
            </div>

            <LoginModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                text="Bạn cần đăng nhập để có thể đăng ký bán hàng!"
            />
        </div>
    )
}

export default TopHeader