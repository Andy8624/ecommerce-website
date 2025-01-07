import { useEffect, useState } from 'react';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { useCartTool } from '../hooks/useCartTool';
import SelectComponent from './SelectComponent';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import { useCartContext } from '../../../components/CartProvider';
import useDeleteCartTool from '../hooks/useDeleteCartTool';
import { useNavigate } from 'react-router-dom';

const CartComponent = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems, cartQuantity, setCartQuantity, selectedItems, setSelectedItems } = useCartContext();

    const userId = useSelector(state => state?.account?.user?.id);
    const { carts } = useCart(userId);
    const { cartTools } = useCartTool(carts?.cartId);
    // console.log(cartTools);

    useEffect(() => {
        if (cartTools?.result) {
            const newItems = cartTools.result.map(item => ({
                id: item.cartToolId,
                type: 'product',
                name: item.tool.name,
                price: item.tool.price,
                discountPrice: item.tool.discountedPrice,
                quantity: item.quantity,
                image: item.tool.imageUrl,
                toolId: item.tool.toolId
            }));
            setCartItems(prevCartItems => {
                const uniqueNewItems = newItems.filter(newItem =>
                    !prevCartItems.some(existingItem => existingItem.id === newItem.id)
                );
                return [...prevCartItems, ...uniqueNewItems];
            });
        }
    }, [cartTools?.result, setCartItems]);

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

    const getTotal = () => {
        return cartItems.reduce((total, item) =>
            selectedItems.includes(item.id) ? total + (item.discountPrice || item.price) * item.quantity : total, 0
        );
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const [selectedType, setSelectedType] = useState('all');
    const handleSelectType = (value) => {
        setSelectedType(value);
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-3 text-center">
                    <div className="mb-1">Giỏ hàng của bạn</div>
                    <SelectComponent onSelectType={handleSelectType} />
                </h2>
                <CartList
                    cartItems={cartItems.filter(item => selectedType === 'all' || item.type === selectedType)}
                    selectedItems={selectedItems}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onToggleSelect={toggleSelectItem}
                />
                {cartQuantity === 0 ||
                    <CartSummary
                        total={getTotal()}
                        onCheckout={handleCheckout}
                        isDisabled={selectedItems.length === 0}
                    />
                }
            </div>
        </div>
    );
};

export default CartComponent;
