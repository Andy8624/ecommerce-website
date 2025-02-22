import { Tabs, Form, Button, Typography } from "antd";
import { useState } from "react";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import DetailedInfo from "./DetailedInfo";

const { Title } = Typography;

const ProductForm = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("1");

    const handleSubmit = (values) => {
        console.log("Submitted Data:", values);
    };

    return (
        <>
            <Title level={2}>Thêm sản phẩm</Title>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                    <Tabs.TabPane tab="Thông tin cơ bản" key="1">
                        <BasicInfo form={form} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Thông tin chi tiết" key="2">
                        <DetailedInfo form={form} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Thông tin bán hàng" key="3">
                        <SalesInfo form={form} />
                    </Tabs.TabPane>
                </Tabs>
                <Button type="primary" htmlType="submit" className="mt-4">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default ProductForm;