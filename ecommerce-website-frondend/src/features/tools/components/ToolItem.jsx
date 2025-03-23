import { Card } from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
// import { useCreateCartTool } from "../../cart/hooks/useCreateCartTool";
// import { useCheckExistCartTool } from "../../cart/hooks/useCheckExistCartTool";
// import { useUpdateCartItem } from "../../cart/hooks/useUpdateCartItem";
// import { useSelector } from "react-redux";
// import { useCart } from "../../cart/hooks/useCart";
import { TOOL_URL } from "../../../utils/Config";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { handleAddToCart } from "../../cart/handleAddtoCart";
// import LoginModal from "../../../components/LoginModal";
// import { useCartContext } from "../../../hooks/useCartContext";

const { Meta } = Card;

const ToolItem = ({ tool }) => {
    // console.log("ToolItem: ", tool);
    const navigate = useNavigate();
    // const { cartItems, setCartItems, cartQuantity, setCartQuantity } = useCartContext();
    // const userId = useSelector(state => state?.account?.user?.id);
    // const permissions = useSelector(state => state.account.user?.role?.permissions);
    // const { carts } = useCart(userId);
    // const { createCartItem, isCreating } = useCreateCartTool();
    // const { updateCartItem } = useUpdateCartItem();
    // const { checkExist } = useCheckExistCartTool();

    // const [isModalVisible, setIsModalVisible] = useState(false);

    // const onAddToCartClick = async () => {
    //     if (userId == undefined || userId == null || userId == "") {
    //         return setIsModalVisible(true);
    //     }

    //     await handleAddToCart({
    //         tool,
    //         permissions,
    //         carts,
    //         checkExist,
    //         createCartItem,
    //         updateCartItem,
    //         cartItems,
    //         setCartItems,
    //         cartQuantity,
    //         setCartQuantity,
    //         addQuantity: 1,
    //     });
    // };


    // Hàm chuyển đến trang chi tiết sản phẩm
    const navigateToDetailPage = () => {
        navigate(`/tool/${tool.toolId}`, { state: tool });
    };

    return (
        <>
            <Card
                className="transition-transform duration-100 hover:scale-95 shadow-xl"
                hoverable
                cover={
                    <img
                        alt={tool.name}
                        src={TOOL_URL + tool.imageUrl}
                        className="h-48 w-full object-cover cursor-pointer"
                        onClick={navigateToDetailPage}
                    />
                }
            // actions={[
            //     <Button
            //         type="dark"
            //         className="text-base transition-transform duration-100 hover:scale-110 text-[var(--gold-light)] bg-[var(--primary-color)]"
            //         key="cart"
            //         onClick={onAddToCartClick}
            //         disabled={isCreating}
            //     >
            //         {isCreating ? "Đang thêm..." : <>
            //             <ShoppingCartOutlined className="mr-2" />
            //             Thêm vào giỏ hàng
            //         </>
            //         }
            //     </Button>
            // ]}
            >
                <Meta
                    title={
                        <span
                            className="text-sm cursor-pointer text-two-lines product-name"
                            onClick={navigateToDetailPage}
                        >
                            {tool.name}
                        </span>
                    }
                    description={
                        <div onClick={navigateToDetailPage}>
                            <div className="text-red-500">
                                {tool.discountedPrice !== 0 ? (
                                    <>
                                        <span className="text-gray-500 line-through">
                                            {tool.price.toLocaleString()}₫
                                        </span>{" "}
                                        {tool.discountedPrice?.toLocaleString()}₫
                                    </>
                                ) : (
                                    <>
                                        {tool.price?.toLocaleString()}₫
                                    </>
                                )}
                            </div>
                        </div>
                    }
                />
            </Card>

            {/* <LoginModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                text="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!"
            /> */}

        </>
    );
};

export default ToolItem;
