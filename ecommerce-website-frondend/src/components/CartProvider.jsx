import { createContext, useContext, useState, useEffect } from 'react';
import { useCartTool } from '../features/cart/hooks/useCartTool';
import { useSelector } from 'react-redux';
import { useCart } from '../features/cart/hooks/useCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const userId = useSelector(state => state?.account?.user?.id);
    const { carts } = useCart(userId);
    const { cartTools } = useCartTool(carts?.cartId);

    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        if (cartTools) {
            // Cập nhật `cartItems` khi `cartTools` thay đổi
            const newItems = cartTools.map(item => ({
                id: item.cartToolId,
                type: 'product',
                name: item.tool.name,
                price: item.tool.price,
                discountPrice: item.tool.discountedPrice,
                quantity: item.quantity,
                image: item.tool.imageUrl,
                toolId: item.tool.toolId
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

export const useCartContext = () => useContext(CartContext);
