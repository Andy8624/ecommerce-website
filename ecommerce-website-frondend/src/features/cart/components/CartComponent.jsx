import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";
import useDeleteCartTool from "../hooks/useDeleteCartTool";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../../hooks/useCartContext";
import { useMemo, useEffect, useState } from "react";
import { callGetVariantDetailById } from "../../../services/VariantDetailService";

const CartComponent = () => {
    const navigate = useNavigate();
    const {
        cartItems, setCartItems,
        cartQuantity, setCartQuantity,
        selectedItems, setSelectedItems
    } = useCartContext();
    const [updatedCartItems, setUpdatedCartItems] = useState(cartItems);

    const { updateCartItem } = useUpdateCartItem();
    const updateQuantity = (id, quantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
        updateCartItem({
            data: { quantity },
            cartToolId: id
        });
    };

    const { deleteCartTool } = useDeleteCartTool();
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        deleteCartTool(id);
        setCartQuantity(cartQuantity - 1);
    };


    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    // Fetch giá chi tiết của từng sản phẩm trong giỏ hàng
    useEffect(() => {
        const fetchPrices = async () => {
            if (cartItems.length === 0) {
                setUpdatedCartItems([]);
                return;
            }
            const updatedItems = await Promise.all(
                cartItems.map(async (item) => {
                    if (!item.variantDetailId1) return item;
                    const variantDetail1 = await callGetVariantDetailById(item.variantDetailId1);
                    const variantDetail2 = await callGetVariantDetailById(item.variantDetailId2);
                    return { ...item, price: variantDetail1?.price || item.price, variantDetail1, variantDetail2 };
                })
            );
            setUpdatedCartItems(updatedItems);
        };
        fetchPrices();
    }, [cartItems]);

    // Tính tổng giá trị sau khi cập nhật giá mới
    const total = useMemo(() => {
        return updatedCartItems.reduce(
            (total, item) =>
                selectedItems.includes(item.id) ? total + item.price * item.quantity : total,
            0
        );
    }, [updatedCartItems, selectedItems]);

    const selectCartItemsDetail = useMemo(() => {
        return updatedCartItems.filter(item => selectedItems.includes(item.id));
    }, [updatedCartItems, selectedItems]);

    const handleCheckout = () => {
        navigate("/checkout", { state: { checkoutProduct: selectCartItemsDetail } });
    };

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-[80%] mt-[20px] mb-[7.5rem]">
                <h2 className="text-center font-bold text-2xl mb-3 p-3 bg-white shadow-lg rounded-lg text-[var(--primary-color)]">
                    Giỏ hàng của bạn
                </h2>
                <hr />
                <CartList
                    cartItems={updatedCartItems}
                    setCartItems={setCartItems}
                    selectedItems={selectedItems}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onToggleSelect={toggleSelectItem}
                />
                {cartQuantity > 0 && (
                    <CartSummary
                        total={total}
                        length={selectedItems?.length}
                        onCheckout={handleCheckout}
                        isDisabled={selectedItems.length === 0}
                    />
                )}
            </div>
        </div>
    );
};

export default CartComponent;
