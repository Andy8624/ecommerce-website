import { useEffect } from "react";
import { Form, Input, Radio, Button, Row, Col, DatePicker } from "antd";
import { MailOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ProfileContentForm = ({ onFinish, user, isUpdating }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email || "",
                fullName: user.fullName || "",
                phone: user.phone || "",
                gender: user.gender || "MALE",
                birthdate: user?.birthdate ? dayjs(user?.birthdate).tz("Asia/Ho_Chi_Minh") : null,
            });
        }
    }, [user, form]);

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{
                email: user?.email || "",
                fullName: user?.fullName || "",
                phone: user?.phone || "",
                gender: user?.gender || "male",
                birthdate: user?.birthdate ? dayjs(user?.birthdate).tz("Asia/Ho_Chi_Minh") : null,
            }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input disabled="true" prefix={<MailOutlined />} placeholder="example@gmail.com" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
                    >
                        <Input placeholder="Nhập tên của bạn" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Ngày sinh"
                        name="birthdate"
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="dd/mm/yyyy"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                pattern: /^[0-9]{10}$/,
                                message: "Số điện thoại không hợp lệ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Giới tính" name="gender">
                        <Radio.Group>
                            <Radio value="MALE">Nam</Radio>
                            <Radio value="FEMALE">Nữ</Radio>
                            <Radio value="OTHER">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" block disabled={isUpdating}>
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProfileContentForm;
