import { BiSupport } from "react-icons/bi";
import { FaFacebook, FaInstagram, FaRegBell } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useUpdateUserRoleByUserId } from "../../features/auth/hooks/useUpdateUserRoleByUserId";
import { useGetUserById } from "../../hooks/useGetUserById";
// import { useQueryClient } from "@tanstack/react-query";
import { Avatar } from "antd";
import { AVT_URL } from "../../utils/Config";
// import { useAddressUser } from "../../hooks/useAddressUser";
import { UserOutlined } from "@ant-design/icons";

const TopHeader = () => {
    const navigate = useNavigate();
    // const queryClient = useQueryClient();
    const email = useSelector(state => state.account?.user?.email);
    const imageUrl = useSelector(state => state.account?.user?.imageUrl);

    const userId = useSelector(state => state.account?.user?.id);
    const { getUserById } = useGetUserById(userId);

    // const { updateUserRole } = useUpdateUserRoleByUserId();

    const handleBecomeSeller = () => {
        navigate("/become-seller/accept");
        // updateUserRole({ userId, role: { roleId: 2 } });
        // queryClient.invalidateQueries(["users", userId]);    
    }


    const leftMenuItems = [
        {
            key: "seller",
            label: (
                <span className="flex items-center gap-2">
                    {getUserById?.role?.name === "BUYER" ?
                        "Trở Thành Người Bán" :
                        "Kênh Người Bán"}
                </span>
            ),
            onClick: () => {
                if (getUserById?.role?.name === "BUYER") {
                    handleBecomeSeller();
                } else {
                    navigate("/seller");
                }

            },
        },
        { key: "app", label: "Tải Ứng Dụng", onClick: () => toast.info("Tính năng đang phát triển") },
        {
            key: "connect",
            label: (
                <span className="flex items-center gap-2">
                    Kết Nối
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
                <span className="flex items-center gap-1">
                    <FaRegBell className="text-[0.85rem]" />
                    Thông Báo
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "support",
            label: (
                <span className="flex items-center gap-1">
                    <BiSupport className="text-[0.85rem]" />
                    Hỗ Trợ
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "language",
            label: (
                <span className="flex items-center gap-1">
                    <GrLanguage className="text-[0.85rem]" />
                    Tiếng Việt
                </span>
            ),
            onClick: () => toast.info("Tính năng đang phát triển")
        },
        {
            key: "user",
            label: (
                <span className="flex items-center gap-2">
                    <Avatar
                        src={AVT_URL + imageUrl}
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
            className="flex justify-between items-center text-white px-[65px] py-2 text-[0.85rem] fixed-header"
            style={{ backgroundColor: "#8294C4", zIndex: "1001" }}
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
        </div>
    )
}

export default TopHeader