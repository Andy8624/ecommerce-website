import { Row, Col } from 'antd';

const categories = [
    {
        name: 'Bút Bi',
        image: 'https://via.assets.so/watch.png?id=1',
    },
    {
        name: 'Bút Chì',
        image: 'https://via.assets.so/watch.png?id=2',
    },
    {
        name: 'Tẩy',
        image: 'https://via.assets.so/watch.png?id=3',
    },
    {
        name: 'Thước Kẻ',
        image: 'https://via.assets.so/watch.png?id=4',
    },
    {
        name: 'Giấy Note',
        image: 'https://via.assets.so/watch.png?id=5',
    },
    {
        name: 'Kẹp Giấy',
        image: 'https://via.assets.so/watch.png?id=6',
    },
    {
        name: 'Băng Dính',
        image: 'https://via.assets.so/watch.png?id=7',
    },
    {
        name: 'Ghim Bấm',
        image: 'https://via.assets.so/watch.png?id=8',
    },
    {
        name: 'Bìa Hồ Sơ',
        image: 'https://via.assets.so/watch.png?id=9',
    },
    {
        name: 'Sổ Tay',
        image: 'https://via.assets.so/watch.png?id=10',
    },
    {
        name: 'Bảng Trắng',
        image: 'https://via.assets.so/watch.png?id=11',
    },
    {
        name: 'Phấn Viết Bảng',
        image: 'https://via.assets.so/watch.png?id=12',
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