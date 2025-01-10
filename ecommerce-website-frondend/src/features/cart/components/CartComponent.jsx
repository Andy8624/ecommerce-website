import { useState } from 'react';
import CartList from './CartList';
import CartSummary from './CartSummary';
import SelectComponent from './SelectComponent';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import useDeleteCartTool from '../hooks/useDeleteCartTool';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../../hooks/useCartContext';

const CartComponent = () => {
    const navigate = useNavigate();
    const {
        cartItems, setCartItems,
        cartQuantity, setCartQuantity,
        selectedItems, setSelectedItems
    } = useCartContext();

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
        return cartItems.reduce(
            (total, item) =>
                selectedItems.includes(item.id) ? total + (item.discountPrice || item.price) * item.quantity : total
            , 0
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
