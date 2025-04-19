import { Row, Col } from 'antd';

const categories = [
    {
        name: 'Bút Bi',
        image: 'assets/category/butbi.webp',
    },
    {
        name: 'Bút Chì',
        image: 'assets/category/butchi.png  ',
    },
    {
        name: 'Tẩy',
        image: 'assets/category/gom.png',
    },
    {
        name: 'Thước Kẻ',
        image: 'assets/category/thuoc.webp',
    },
    {
        name: 'Giấy Note',
        image: 'assets/category/giaynote.webp',
    },
    {
        name: 'Kéo',
        image: 'assets/category/keo.jpg',
    },
    {
        name: 'Bút xóa',
        image: 'assets/category/butxoa.webp',
    },
    {
        name: 'Giấy',
        image: 'assets/category/giay.jpeg',
    },
    {
        name: 'Bìa Hồ Sơ',
        image: 'assets/category/biasomi.webp',
    },
    {
        name: 'Sổ Tay',
        image: 'assets/category/sotay.jpeg',
    },
    {
        name: 'Bảng Trắng',
        image: 'assets/category/bang.webp',
    },
    {
        name: 'Phấn Viết Bảng',
        image: 'assets/category/phan.jpeg',
    },
];

const CategoryComponent = () => {
    return (
        <div className="container mx-auto">
            <Row gutter={[0, 0]}>
                {categories.map((category) => (
                    <Col xs={12} sm={8} md={4} lg={4} xl={4} xxl={4} key={category.name}>
                        <div className="flex flex-col items-center border p-4 rounded cursor-pointer hover:shadow-lg transition-shadow duration-300">
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