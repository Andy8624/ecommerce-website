import { Collapse, List, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;

const OrderDetailCollapse = ({ orderItems }) => {
    const navigate = useNavigate();
    return (
        <Collapse
            defaultActiveKey={[]}
            className="mt-2"
            items={[
                {
                    key: 'details',
                    label: "Chi tiết đơn hàng",
                    children: (
                        <List
                            size="small"
                            dataSource={orderItems}
                            renderItem={item => (
                                <List.Item
                                    className="border-b border-gray-200 py-1 flex justify-between items-center"
                                    onClick={() => { navigate(`/tool/${item.tool.toolId}`) }}
                                >
                                    <Text className="text-gray-800 flex-1">{item.tool.name}</Text>
                                    <div className="text-gray-800 w-48">
                                        <Text className="mr-2">(x{item.quantity})</Text>
                                        <Text>Đơn giá: {(item.tool.discountedPrice || item.tool.price)?.toLocaleString()}₫</Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    ),
                },
            ]}
        />)
}

export default OrderDetailCollapse