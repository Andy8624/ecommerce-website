import { createContext, useState, useEffect } from 'react';
import { useCartTool } from '../features/cart/hooks/useCartTool';
import { useSelector } from 'react-redux';
import { useCart } from '../features/cart/hooks/useCart';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const userId = useSelector(state => state?.account?.user?.id);
    const { carts } = useCart(userId);
    const { cartTools } = useCartTool(carts?.cartId);
    // console.log(cartTools);

    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        if (cartTools) {
            const newItems = cartTools.map(item => ({
                id: item.cartToolId,
                type: 'product',
                name: item.tool.name,
                price: item.tool.price,
                discountPrice: item.tool.discountedPrice,
                width: item.tool.width,
                height: item.tool.height,
                length: item.tool.length,
                weight: item.tool.weight,
                quantity: item.quantity,
                image: item.tool.imageUrl,
                toolId: item.tool.toolId,
                variantDetailId1: item.variantDetailId1,
                variantDetailId2: item.variantDetailId2,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,

                ownerUser: {
                    userId: item.tool.user.userId,
                    email: item.tool.user.email,
                    fullName: item.tool.user.fullName,
                    imageUrl: item.tool.user.imageUrl,
                    gender: item.tool.user.gender,
                    phone: item.tool.user.phone,
                    shopAddressId: item.tool.user.shopAddressId,
                    shopName: item.tool.user.shopName,
                },
                role: {
                    roleId: item.tool.user.role.roleId,
                    name: item.tool.user.role.name
                },
                toolType: {
                    toolTypeId: item.tool.toolType.toolTypeId,
                    name: item.tool.toolType.name
                }
            }));
            setCartItems(newItems);
            setCartQuantity(newItems.length);
        }
    }, [cartTools]);

    const [selectedItems, setSelectedItems] = useState([]);

    return (
        <CartContext.Provider value={{
            cartItems, setCartItems,
            cartQuantity, setCartQuantity,
            selectedItems, setSelectedItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider; 
