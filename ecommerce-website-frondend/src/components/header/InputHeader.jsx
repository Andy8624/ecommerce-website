import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Upload, message } from "antd";
import { truncateDescription } from "../../utils/truncaseDesc";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callSearchProductByImage } from "../../services/ImageSearchService";
import { sematicSearch } from "../../services/RecomendationService";

const InputHeader = () => {
    const [searchText, setSearchText] = useState("");
    const [isSemanticSearch, setIsSemanticSearch] = useState(false);
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

    // Xử lý thay đổi text trong ô tìm kiếm
    const handleSearchTextChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        // Kiểm tra xem text có bắt đầu bằng @ không
        const isStartWithAt = text.startsWith('@');
        setIsSemanticSearch(isStartWithAt);
    };

    // Xử lý tìm kiếm văn bản
    const handleSearchText = async () => {
        if (!searchText.trim()) {
            message.warning("Vui lòng nhập từ khóa tìm kiếm.");
            return;
        }

        try {
            if (isSemanticSearch) {
                // Tìm kiếm ngữ nghĩa nếu bắt đầu bằng @
                const semanticQuery = searchText.substring(1).trim(); // Bỏ @ ở đầu
                if (!semanticQuery) {
                    message.warning("Vui lòng nhập từ khóa tìm kiếm sau @.");
                    return;
                }

                message.loading({
                    content: 'Đang tìm kiếm ngữ nghĩa...',
                    key: 'semanticSearch'
                });

                const results = await sematicSearch(semanticQuery, 20);

                message.success({
                    content: `Tìm thấy ${results.results_count} kết quả liên quan đến "${semanticQuery}"`,
                    key: 'semanticSearch'
                });

                // Chuyển đến trang kết quả tìm kiếm ngữ nghĩa
                navigate("/result-semantic-search", {
                    state: {
                        searchResults: results,
                        query: semanticQuery
                    }
                });
            } else {
                // Tìm kiếm thông thường
                const path = `http://localhost:8000/python/api/v1/search?query=${encodeURIComponent(searchText)}`;
                const response = await axios.get(path);
                console.log("Kết quả tìm kiếm bằng text:", response?.data?.results);
                message.success("Tìm kiếm thành công!");
            }
        } catch (error) {
            message.error("Lỗi khi tìm kiếm.");
            console.error("API error:", error);
        }
    };

    // Xử lý tìm kiếm bằng ảnh
    const handleUpload = async (file) => {
        try {
            // Tạo URL của ảnh để hiển thị
            const imageUrl = URL.createObjectURL(file);

            // Chuyển hướng và gửi ảnh kèm theo qua state
            navigate("/result-search-image", {
                state: { searchedImage: imageUrl }
            });

            // Vẫn gọi API tìm kiếm như bình thường
            callSearchProductByImage(file, dispatch);
        } catch (error) {
            console.error("Error processing image:", error);
            message.error("Có lỗi xảy ra khi xử lý ảnh");
        }

        return false;
    };

    return (
        <div className="relative w-[50%] mt-2">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center space-x-2">
                {/* Ô nhập tìm kiếm */}
                <Input
                    placeholder="Tìm kiếm thường hoặc @tìm kiếm ngữ nghĩa"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    onPressEnter={handleSearchText}
                    suffix={
                        <SearchOutlined
                            className={`px-2 cursor-pointer text-xl hover:text-[var(--gold-medium)] active:scale-75 transition duration-200 ${isSemanticSearch ? 'text-blue-500' : 'text-gray-500'}`}
                            onClick={handleSearchText}
                        />
                    }
                    className={`w-full ps-4 py-2 rounded-lg border-transparent shadow-sm hover:border-[var(--gold-medium)] focus:border-[var(--gold-medium)] focus-within:border-[var(--gold-medium)] ${isSemanticSearch ? 'text-blue-500' : ''}`}
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
                        onClick={() => {
                            setSearchText(suggestion);
                            setIsSemanticSearch(false);
                            handleSearchText();
                        }}
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
