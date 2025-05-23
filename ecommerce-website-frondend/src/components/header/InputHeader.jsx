import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Upload, message } from "antd";
import { truncateDescription } from "../../utils/truncaseDesc";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callSearchProductByImage } from "../../services/ImageSearchService";
import { sematicSearch } from "../../services/RecomendationService";
import { searchToolByName } from "../../services/ToolService";

const InputHeader = () => {
    const [searchText, setSearchText] = useState("");
    const [isSemanticSearch, setIsSemanticSearch] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const debounceTimerRef = useRef(null);

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

    // Xử lý thay đổi text trong ô tìm kiếm với debounce
    const handleSearchTextChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        // Kiểm tra xem text có bắt đầu bằng @ không
        const isStartWithAt = text.startsWith('@');
        setIsSemanticSearch(isStartWithAt);
    };

    // Xử lý tìm kiếm văn bản
    const handleSearchText = async (customText) => {
        // Hủy timer debounce cũ nếu có
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Sử dụng customText nếu được cung cấp, ngược lại sử dụng searchText từ state
        const textToSearch = customText !== undefined ? customText : searchText;

        if (!textToSearch.trim()) {
            message.warning("Vui lòng nhập từ khóa tìm kiếm.");
            return;
        }

        try {
            // Kiểm tra lại có phải tìm kiếm ngữ nghĩa hay không
            const isSearchSemantic = textToSearch.startsWith('@');

            if (isSearchSemantic) {
                // Tìm kiếm ngữ nghĩa nếu bắt đầu bằng @
                const semanticQuery = textToSearch.substring(1).trim(); // Bỏ @ ở đầu
                if (!semanticQuery) {
                    message.warning("Vui lòng nhập từ khóa tìm kiếm sau @.");
                    return;
                }

                message.loading({
                    content: 'Đang tìm kiếm ngữ nghĩa...',
                    key: 'semanticSearch',
                    duration: 50,
                });

                const results = await sematicSearch(semanticQuery, 200);

                message.success({
                    content: `Tìm kiếm thành công kết quả liên quan đến "${semanticQuery}"`,
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
                message.loading({
                    content: 'Đang tìm kiếm...',
                    key: 'normalSearch',
                    duration: 50,
                });

                // Gọi API tìm kiếm sản phẩm theo tên
                const results = await searchToolByName(textToSearch);

                message.success({
                    content: `Đã tìm thấy ${results?.length || 0} kết quả cho "${textToSearch}"`,
                    key: 'normalSearch'
                });

                // Chuyển đến trang kết quả tìm kiếm
                navigate("/search-results", {
                    state: {
                        searchResults: results,
                        query: textToSearch
                    }
                });
            }
        } catch (error) {
            message.error("Lỗi khi tìm kiếm.");
            console.error("API error:", error);
        }
    };

    // Debounce việc tìm kiếm khi người dùng nhập
    useEffect(() => {
        // Chỉ áp dụng debounce cho tìm kiếm thông thường, không phải tìm kiếm ngữ nghĩa
        if (searchText && !isSemanticSearch && searchText.trim()) {
            // Hủy timer debounce cũ nếu có
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Tạo timer mới - chỉ tìm kiếm sau 500ms người dùng ngừng gõ
            debounceTimerRef.current = setTimeout(() => {
                // Không tự tìm kiếm khi gõ, chỉ khi nhấn Enter hoặc nút tìm kiếm
                debounceTimerRef.current = null;
            }, 500);
        }

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchText, isSemanticSearch]);

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

    // Xử lý khi click vào gợi ý
    const handleSuggestionClick = (suggestion) => {
        const newSearchText = "@" + suggestion;
        setSearchText(newSearchText);
        setIsSemanticSearch(true);
        // Truyền trực tiếp giá trị mới vào hàm tìm kiếm
        handleSearchText(newSearchText);
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
                    onPressEnter={() => handleSearchText()}
                    suffix={
                        <SearchOutlined
                            className={`px-2 cursor-pointer text-xl hover:text-[var(--gold-medium)] active:scale-75 transition duration-200 ${isSemanticSearch ? 'text-blue-500' : 'text-gray-500'}`}
                            onClick={() => handleSearchText()}
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
                        onClick={() => handleSuggestionClick(suggestion)}
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
