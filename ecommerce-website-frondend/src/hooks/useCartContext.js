import { useContext } from 'react';
import { CartContext } from '../components/CartProvider';

export const useCartContext = () => useContext(CartContext);
