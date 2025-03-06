import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Typography, Avatar, Upload, Button, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import ProfileContentForm from "./ProfileContentForm";
import { useUpdateProfile } from "../hooks/useUserProfile";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { uploadFile } from "../../../services/FileService";
import { fetchAccount } from "../../../redux/slices/accountSlice";
import { useGetUserById } from "../hooks/useGetUserByUserId";
import { AVT_URL } from "../../../utils/Config";

const { Title } = Typography;

const ProfileContent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.account?.user);
    const { getUserById } = useGetUserById(user?.id);
    const { updateProfile, isUpdating } = useUpdateProfile();
    const [avatarUrl, setAvatarURl] = useState(getUserById?.imageUrl || null); // Avatar URL state
    useEffect(() => {
        setAvatarURl(AVT_URL + getUserById?.imageUrl);
    }, [getUserById]);

    const [previewUrl, setPreviewUrl] = useState(null); // Preview URL state
    const [selectedFile, setSelectedFile] = useState(null); // File được chọn để upload sau

    // Kiểm tra file trước khi upload
    const beforeUpload = (file) => {
        const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
        if (!isImage) {
            message.error("Chỉ cho phép file định dạng JPEG, JPG hoặc PNG !");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2; // Check file size < 2MB
        if (!isLt2M) {
            message.error("Dung lượng file phải nhỏ hơn 2MB!");
            return Upload.LIST_IGNORE;
        }

        // Hiển thị preview ngay lập tức
        const previewReader = new FileReader();
        previewReader.onload = (e) => setPreviewUrl(e.target.result);
        previewReader.readAsDataURL(file);

        setSelectedFile(file); // Lưu file vào state để upload sau
        return false; // Không upload ngay lập tức
    };

    // Xử lý submit form
    const handleFinish = async (values) => {
        let uploadedImageUrl = avatarUrl;

        const processedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value === "" ? null : value])
        );
        console.log(processedValues);
        try {
            // Nếu có ảnh được chọn, upload ảnh trước
            if (selectedFile) {
                const uploadedFileName = await uploadFile(selectedFile, "avatars");
                uploadedImageUrl = uploadedFileName; // URL ảnh được cập nhật từ server
            }
            // Gửi thông tin hồ sơ cùng URL ảnh
            const formattedValues = {
                ...processedValues,
                birthdate: processedValues?.birthdate
                    ? dayjs(processedValues?.birthdate).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")
                    : null,
                imageUrl: uploadedImageUrl, // Cập nhật URL ảnh vào profile
            };
            await updateProfile({ data: formattedValues, userId: user?.id });
            message.success("Hồ sơ đã được cập nhật thành công!");
            // Gọi lại fetchAccount để cập nhật Redux
            dispatch(fetchAccount());
        } catch (error) {
            console.error("Lỗi khi cập nhật hồ sơ:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <>
            {/* Header */}
            <Title level={3}>
                Hồ sơ của tôi
            </Title>
            <p style={{ marginBottom: "30px", color: "#888" }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            {/* Avatar và Form */}
            <Row gutter={24}>
                {/* Form */}
                <Col xs={24} sm={16} md={18}>
                    <ProfileContentForm isUpdating={isUpdating} user={getUserById} onFinish={handleFinish} />
                </Col>

                {/* Avatar */}
                <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
                    <Avatar
                        size={108}
                        src={previewUrl || avatarUrl} // Hiển thị preview nếu có, ngược lại dùng URL từ server
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#888", marginBottom: "16px" }}
                    />
                    <Upload
                        listType="picture-card"
                        maxCount={1} // Chỉ cho phép 1 ảnh
                        beforeUpload={beforeUpload} // Kiểm tra file trước khi upload
                        showUploadList={false} // Không hiển thị danh sách file upload
                    >
                        <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                    </Upload>
                    <p style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
                        Dung lượng file tối đa 2 MB. Định dạng: .JPEG, .PNG
                    </p>
                </Col>
            </Row>
        </>
    );
};

export default ProfileContent;
