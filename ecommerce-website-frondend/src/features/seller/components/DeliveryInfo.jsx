import { Form, Input } from 'antd';

const DeliveryInfo = () => {
    return (
        <div >
            <span className="flex flex-col mb-2">
                Cân nặng (Sau khi đóng gói)
            </span>
            <Form.Item
                rules={[{ required: true, message: 'Không được để trống ô' }]}
                name='weight'
            >
                <Input placeholder="Nhập trọng lượng" className="w-48 mr-3" min={0} suffix="gram" />
            </Form.Item>

            <div className="mb-2 mt-5">Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn nhập sai kích thước)</div>
            <div className="flex">
                <Form.Item
                    rules={[{ required: true, message: 'Không được để trống ô' }]}
                    name='length'
                >
                    <Input placeholder="Nhập chiều dài" className="w-48 mr-3" min={0} suffix="cm" />
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: 'Không được để trống ô' }]}
                    name='width'
                >
                    <Input placeholder="Nhập chiều rộng" className="w-48 mr-3" min={0} suffix="cm"
                    />
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: 'Không được để trống ô' }]}
                    name='height'
                >
                    <Input placeholder="Nhập chiều cao" className="w-48 mr-3" min={0} suffix="cm" />
                </Form.Item>
            </div>
        </div>
    );
};

export default DeliveryInfo;