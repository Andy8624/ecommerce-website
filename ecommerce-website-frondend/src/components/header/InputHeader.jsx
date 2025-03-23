import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Upload, message } from "antd";
import { truncateDescription } from "../../utils/truncaseDesc";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callSearchProductByImage } from "../../services/ImageSearchService";

const InputHeader = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const suggestionList = [
        "Bút Máy Cao Cấp",
        "Mực Viết Nhật Bản",
        "Giấy Ghi Chú Không Phai",
        "Bút Bi Gel",
        "Bút Chì 2B",
        "Sổ Tay Da Bò",
        "Mực Xóa Nhanh",
        "Giấy A4 Định Lượng Cao",
    ];

    // Xử lý tìm kiếm bằng text
    const handleSearchText = async () => {
        if (!searchText.trim()) {
            message.warning("Vui lòng nhập từ khóa tìm kiếm.");
            return;
        }

        try {
            const path = `http://localhost:8000/python/api/v1/search?query=${encodeURIComponent(searchText)}`;
            const response = await axios.get(path);
            console.log("Kết quả tìm kiếm bằng text:", response?.data?.results);
            message.success("Tìm kiếm thành công!");
        } catch (error) {
            message.error("Lỗi khi tìm kiếm.");
            console.error("API error:", error);
        }
    };

    // Xử lý tìm kiếm bằng ảnh
    const handleUpload = async (file) => {
        navigate("/result-search-image");
        callSearchProductByImage(file, dispatch);
        return false;
    };

    return (
        <div className="relative w-[50%] mt-2">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center space-x-2">
                {/* Ô nhập tìm kiếm */}
                <Input
                    placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={handleSearchText} // Nhấn Enter để tìm kiếm
                    suffix={
                        <SearchOutlined
                            className="text-gray-500 px-2 cursor-pointer text-xl hover:text-[var(--gold-medium)] active:scale-75 transition duration-200"
                            onClick={handleSearchText} // Click vào icon search để tìm kiếm
                        />
                    }
                    className="w-full ps-4 py-2 rounded-lg border-transparent shadow-sm hover:border-[var(--gold-medium)] focus:border-[var(--gold-medium)] focus-within:border-[var(--gold-medium)] "
                    style={{ lineHeight: "0rem" }}
                />

                {/* Nút tìm kiếm bằng ảnh */}
                <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                        handleUpload(file);
                        return false; // Ngăn Ant Design tải lên tự động
                    }}
                >
                    <div className="flex items-center justify-center">
                        <button title="Tìm kiếm bằng hình ảnh"
                            className="text-gray-500 hover:text-[var(--gold-medium)] bg-white p-2 rounded-lg hover:bg-gray-200 active:scale-75 transition duration-200 flex items-center justify-center">
                            <CameraOutlined className=" text-2xl " />
                        </button>
                    </div>

                </Upload>
            </div>

            {/* Dòng gợi ý bên dưới */}
            <div
                className="flex text-white text-[0.8rem] justify-start mt-3 py-1 px-2 rounded-b-lg"
                style={{ lineHeight: "0rem", color: "var(--soft-gold-light)" }}
            >
                {suggestionList.slice(0, 5).map((suggestion, index) => (
                    <span
                        key={index}
                        className="hover:underline cursor-pointer whitespace-nowrap mr-3"
                        onClick={() => console.log(`Clicked: ${suggestion}`)}
                        title={suggestion}
                    >
                        {truncateDescription(suggestion, 6)}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default InputHeader;
