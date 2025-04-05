import { useState } from 'react';
import { useOrder } from '../features/seller/hooks/useOrder';
import { useSelector } from 'react-redux';

const SellerHome = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = useSelector(state => state?.account?.user?.id);
    const { orders: allShopOrder, isLoading, error: errorGetShopOrder } = useOrder(userId);
    console.log("allShopOrder", allShopOrder);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>

        </div>
    );
};

export default SellerHome;

