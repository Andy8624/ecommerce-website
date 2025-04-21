import { Row, Col } from 'antd';
import { useGetAllToolType } from '../features/seller/hooks/useGetAllToolType';
import { getAllToolByToolTypeId } from '../services/ToolService';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        name: 'Bút Bi',
        image: 'assets/category/butbi.webp',
        toolTypeId: 1  // Bút bi - ID từ API
    },
    {
        name: 'Bút Chì',
        image: 'assets/category/butchi.png',
        toolTypeId: 2  // Bút chì - ID từ API
    },
    {
        name: 'Tẩy',
        image: 'assets/category/gom.png',
        toolTypeId: 31  // Gôm - ID từ API
    },
    {
        name: 'Thước Kẻ',
        image: 'assets/category/thuoc.webp',
        toolTypeId: 12  // Thước kẻ - ID từ API
    },
    {
        name: 'Giấy Note',
        image: 'assets/category/giaynote.webp',
        toolTypeId: 8  // Giấy note - ID từ API
    },
    {
        name: 'Kéo',
        image: 'assets/category/keo.jpg',
        toolTypeId: 14  // Kéo - ID từ API
    },
    {
        name: 'Bút xóa',
        image: 'assets/category/butxoa.webp',
        toolTypeId: 5  // Bút xóa - ID từ API
    },
    {
        name: 'Giấy',
        image: 'assets/category/giay.jpeg',
        toolTypeId: 7  // Giấy in - ID từ API
    },
    {
        name: 'Bìa Hồ Sơ',
        image: 'assets/category/biasomi.webp',
        toolTypeId: 23  // Bìa còng - ID từ API (gần nhất với Bìa Hồ Sơ)
    },
    {
        name: 'Sổ Tay',
        image: 'assets/category/sotay.jpeg',
        toolTypeId: 26  // Sổ tay - ID từ API
    },
    {
        name: 'Bảng Trắng',
        image: 'assets/category/bang.webp',
        toolTypeId: 28  // Bảng trắng - ID từ API
    },
    {
        name: 'Phấn Viết Bảng',
        image: 'assets/category/phan.jpeg',
        toolTypeId: 29  // Phấn - ID từ API
    },
];

const CategoryComponent = () => {
    const navigate = useNavigate();
    const { toolTypes } = useGetAllToolType();
    console.log('toolTypes', toolTypes);

    const getAllProductByType = async (typeId) => {
        if (!typeId) {
            console.error('Không có toolTypeId cho danh mục này');
            return;
        }

        try {
            console.log('Đang tìm sản phẩm cho typeId', typeId);
            // Gọi API lấy danh sách sản phẩm
            const products = await getAllToolByToolTypeId(typeId);
            console.log('Sản phẩm tìm được:', products);

            // Chuyển hướng đến trang danh sách sản phẩm với thông tin typeId
            navigate(`/type/${typeId}`, {
                state: {
                    toolTypeId: typeId,
                    products: products,
                    // Tìm tên danh mục từ toolTypes API nếu có
                    toolTypeName: toolTypes?.find(t => t.toolTypeId === typeId)?.name ||
                        categories.find(c => c.toolTypeId === typeId)?.name
                }
            });
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm theo danh mục:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <Row gutter={[0, 0]}>
                {categories.map((category) => (
                    <Col xs={12} sm={8} md={4} lg={4} xl={4} xxl={4} key={category.name}>
                        <div
                            className="flex flex-col items-center border p-4 rounded cursor-pointer hover:shadow-lg transition-shadow duration-300"
                            onClick={() => getAllProductByType(category.toolTypeId)}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-24 h-24 object-contain"
                            />
                            <p className="text-center mt-5">{category.name}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CategoryComponent;