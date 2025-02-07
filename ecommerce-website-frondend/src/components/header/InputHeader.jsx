import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { truncateDescription } from '../../utils/truncaseDesc';

const InputHeader = () => {
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

    return (
        <div className="relative w-[60%]">
            {/* Input thanh tìm kiếm */}
            <Input
                placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                suffix={
                    <SearchOutlined
                        className="text-gray-400 px-2 cursor-pointer text-xl hover:text-blue-500 active:scale-95 transition duration-200"
                        onClick={() => console.log('Kính lúp được nhấn')}
                    />
                }
                className="w-full ps-4 py-2 rounded-lg border-transparent shadow-sm"
                style={{ lineHeight: '0rem' }}
            />
            {/* Dòng gợi ý bên dưới */}
            <div
                className="flex text-white text-[0.8rem] justify-start my-2 py-1 px-2 rounded-b-lg"
                style={{ lineHeight: '0rem' }}
            >
                {suggestionList.slice(0, 5).map(
                    (suggestion, index) => (
                        <span
                            key={index}
                            className="hover:underline cursor-pointer whitespace-nowrap mr-3"
                            onClick={() => console.log(`Clicked: ${suggestion}`)}
                            title={suggestion}
                        >
                            {truncateDescription(suggestion, 6)}
                        </span>
                    )
                )}
            </div>
        </div>
    )
}

export default InputHeader