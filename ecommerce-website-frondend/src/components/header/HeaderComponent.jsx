/* eslint-disable no-unused-vars */
import { Layout, Menu, Input, Avatar, Badge, Button, Dropdown } from 'antd';
import { UserOutlined, SearchOutlined, ShoppingCartOutlined, BookOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { store } from "../../redux/store"
import { useDispatch, useSelector } from 'react-redux';
import { setLogoutUser } from '../../redux/slices/accountSlice';
import { toast } from 'react-toastify';
import { useCartContext } from '../CartProvider';
import { useUpdateUserRoleByUserId } from '../../features/auth/hooks/useUpdateUserRoleByUserId';
import { useEffect, useState } from 'react';
import { useGetRegisterCourses } from '../../hooks/useGetRegisterCourses';
import { useGetPlayListDetail } from '../../hooks/useGetPlayListDetail';
import { searchToolByName } from '../../services/ToolService';
import { TOOL_URL } from '../../utils/Config';

const { Header } = Layout;
const menuItems = [
    { key: '1', label: 'Trang chủ', path: '/' },
    { key: '2', label: 'Sản phẩm', path: '/products' },
    { key: '3', label: 'Khóa học', path: '/courses' },
];

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { cartQuantity } = useCartContext();
    const user = useSelector(state => state.account?.user);
    const permissions = user?.role?.permissions;
    let role = user?.role?.name;
    const userId = user?.id;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        dispatch(setLogoutUser({}));
        toast.success("Đăng xuất thành công!");
        navigate('/');
    };

    const { updateUserRole } = useUpdateUserRoleByUserId();
    const handleBecomeSeller = () => {
        updateUserRole({ userId: user?.id, role: { roleId: 2 } });
        handleLogout();
        navigate('/auth/login');
        toast.success("Bạn đã trở thành người bán hãy đăng nhập lại");
    }

    const menuItemsForDropdown = [
        {
            key: '1',
            label: <span className="block text-base px-1 py-1">Thông tin tài khoản</span>,
        },
        {
            key: '2',
            label: <span className="block text-base px-1 py-1">Đơn hàng của bạn</span>,
            onClick: () => navigate('/order-history'),
        },
        ...(role === 'SELLER' ? [{
            key: '5',
            label: <span className="block text-base px-1 py-1">Quản lý bán hàng</span>,
            onClick: () => navigate('/seller'),
        }] : [{
            key: '4',
            label: <span className="block text-base px-1 py-1">Trở thành người bán</span>,
            onClick: handleBecomeSeller,
        }]),
        {
            type: 'divider',
        },
        {
            key: '3',
            label: <span className="block text-base px-1 py-1">Đăng xuất</span>,
            onClick: handleLogout,
        },
    ];

    const menu = { items: menuItemsForDropdown };

    const handleMenuClick = ({ key }) => {
        const item = menuItems.find((nav) => nav.key === key);
        if (item && item.path) {
            navigate(item.path);
        }
    };

    const { registerCourses } = useGetRegisterCourses(userId);
    const { getPlaylistDetail } = useGetPlayListDetail();

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.trim()) {
            try {
                // Giả sử API endpoint là /api/products/search
                const response = await searchToolByName(value);
                console.log(response);
                setSearchResults(response.slice(0, 5)); // Giới hạn 5 kết quả
                setShowDropdown(true);
            } catch (error) {
                console.error('Error searching products:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleProductClick = (productId) => {
        setSearchResults([]);
        navigate(`/tool/${productId}`);
        setShowDropdown(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            if (registerCourses && registerCourses.length > 0) {
                for (const course of registerCourses) {
                    try {
                        const response = await getPlaylistDetail(course.course.courseUrl);
                        course.playlistDetails = response;
                    } catch (error) {
                        console.error('Error fetching playlist details:', error);
                    }
                }
            }
        };

        fetchPlaylistDetails();
    }, [registerCourses, getPlaylistDetail]);

    const courseMenu = {
        items: registerCourses && registerCourses.length > 0
            ? registerCourses.map((course) => ({
                key: course.course.courseId,
                label: (
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition duration-300 rounded-lg p-2"
                        onClick={() => navigate("/course-detail", { state: { course_from_header: course } })}
                    >
                        <img
                            src={course.playlistDetails?.thumbnail || 'https://via.placeholder.com/60'}
                            alt={course.playlistDetails?.title || course.course.courseId}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                            <p className="text-base font-medium text-gray-800 truncate max-w-[200px]">
                                {course.playlistDetails?.title || 'Đang tải...'}
                            </p>
                            <p className="text-sm text-gray-500">Click để học ngay</p>
                        </div>
                    </div >
                ),
            }))
            : [
                {
                    key: 'no-courses',
                    label: (
                        <p className="text-gray-500 text-sm p-2">
                            Bạn chưa đăng ký khóa học nào.
                        </p>
                    ),
                },
            ]
    };

    return (
        <Header className="flex items-center px-8 h-[70px] shadow-md fixed-header" style={{ backgroundColor: "#8294C4" }}>
            <div className="flex items-center flex-none">
                <div className="text-white text-2xl font-bold cursor-pointer hover:scale-105" onClick={() => navigate('/')}>
                    KD STORE
                </div>
            </div>

            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                defaultSelectedKeys={['1']}
                onClick={handleMenuClick}
                items={menuItems.map((item) => ({
                    key: item.path,
                    label: item.label,
                    onClick: () => navigate(item.path),
                }))}
                className="flex-1 justify-center text-lg"
                style={{ backgroundColor: 'transparent' }}
            />

            <div className="relative">
                <Input
                    placeholder="Tìm kiếm sản phẩm"
                    prefix={<SearchOutlined className="text-gray-400 px-2 cursor-pointer" />}
                    className="w-60 mr-4 rounded-lg border-transparent shadow-sm p-2"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => {
                        // Xóa kết quả tìm kiếm và ẩn dropdown khi ô tìm kiếm mất focus
                        setTimeout(() => {
                            setSearchResults([]);
                            setShowDropdown(false);
                        }, 200); // Thêm delay nhỏ để tránh việc ẩn trước khi chọn mục
                    }}
                />
                {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-lg">
                        {searchResults.map((product) => (
                            <div
                                key={product.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                onClick={() => handleProductClick(product.toolId)}
                            >
                                <img
                                    src={TOOL_URL + product.imageUrl || 'https://via.placeholder.com/40'}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                    <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                    <p className="text-xs text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {permissions?.length === 0 ? (
                <>
                    <button
                        onClick={() => navigate('/auth/login')}
                        type="button"
                        className="text-white-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                        Đăng nhập
                    </button>

                    <button
                        onClick={() => navigate('/auth/register')}
                        type="button"
                        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                        Đăng ký
                    </button>
                </>
            ) : (
                <>
                    <Dropdown menu={courseMenu} placement="bottomLeft" trigger={['click']}>
                        <Button
                            type="text"
                            icon={<BookOutlined />}
                            className="flex items-center justify-center mr-4 text-white hover:text-blue-200 hover:scale-105 transition-transform duration-300 text-base font-medium"
                        >
                            Học tập
                        </Button>
                    </Dropdown>

                    <Button
                        type="text"
                        className="relative flex items-center justify-center p-0 mr-4"
                        onClick={() => navigate("/cart")}
                    >
                        <Badge
                            count={cartQuantity}
                            offset={[0, 4]}
                            className="text-white text-xs font-bold rounded-full hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-cyan-50 rounded-full transition-transform duration-300 hover:scale-105">
                                <ShoppingCartOutlined className="text-black text-xl" />
                            </div>
                        </Badge>
                    </Button>

                    <Dropdown menu={menu} placement="bottomLeft" trigger={['click']}>
                        <Avatar icon={<UserOutlined />} size={38} className="cursor-pointer hover:scale-110" />
                    </Dropdown>
                </>
            )}
        </Header>
    );
};

export default HeaderComponent;
