import { useEffect, useState } from 'react';
import { List, Typography } from 'antd';

const SellerHome = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // const data = await getRecentOrders();
                const data = []
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Typography.Title level={2}>Danh sách đơn hàng gần đây</Typography.Title>
            <List
                itemLayout="horizontal"
                dataSource={orders}
                renderItem={order => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href={`/orders/${order.id}`}>{order.title}</a>} // Adjust based on your order properties
                            description={`Người mua: ${order.buyerName} - Ngày: ${new Date(order.date).toLocaleDateString()}`} // Adjust properties as necessary
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default SellerHome;
