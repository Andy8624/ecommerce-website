import { Form, Input, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDistrictFromGHN, useProviceFromGHN, useWardFromGHN } from '../hooks/addresses/useAddressFromGHN';

const ModalAddressForm = ({ isVisible, onOk, onCancel }) => {
    const [form] = Form.useForm(); // Tạo instance của Form để quản lý
    const [newAddress, setNewAddress] = useState({
        street: '',
        ward: '',
        district: '',
        city: '',
    });

    const [activeField, setActiveField] = useState(''); // Trạng thái xác định input nào đang hiển thị gợi ý
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);

    // Hooks lấy dữ liệu
    const { isLoadingProvince, province } = useProviceFromGHN();
    const { isLoadingDistrict, districts } = useDistrictFromGHN(selectedCityId);
    const { isLoadingWard, wards } = useWardFromGHN(selectedDistrictId);

    const handleInputClick = (field) => {
        setActiveField(field);

        if (field === 'city') {
            setSuggestions(province.map((city) => ({ id: city.ProvinceID, name: city.ProvinceName })));
        } else if (field === 'district' && districts) {
            setSuggestions(districts.map((district) => ({ id: district.DistrictID, name: district.DistrictName })));
        } else if (field === 'ward' && wards) {
            setSuggestions(wards.map((ward) => ({ id: ward.WardCode, name: ward.WardName })));
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value.toLowerCase();
        setNewAddress((prev) => ({ ...prev, [field]: value }));

        if (field === 'city' && province) {
            const filteredCities = province.filter((city) =>
                city.ProvinceName.toLowerCase().includes(value)
            );
            setSuggestions(filteredCities.map((city) => ({ id: city.ProvinceID, name: city.ProvinceName })));
        } else if (field === 'district' && districts) {
            const filteredDistricts = districts.filter((district) =>
                district.DistrictName.toLowerCase().includes(value)
            );
            setSuggestions(filteredDistricts.map((district) => ({ id: district.DistrictID, name: district.DistrictName })));
        } else if (field === 'ward' && wards) {
            const filteredWards = wards.filter((ward) =>
                ward.WardName.toLowerCase().includes(value)
            );
            setSuggestions(filteredWards.map((ward) => ({ id: ward.WardCode, name: ward.WardName })));
        }
    };

    const handleSuggestionClick = (suggestion, field) => {
        if (field === 'city') {
            setNewAddress((prev) => ({ ...prev, city: suggestion.name, district: '', ward: '' }));
            form.setFieldsValue({ city: suggestion.name }); // Cập nhật Form
            setSelectedCityId(suggestion.id);
        } else if (field === 'district') {
            setNewAddress((prev) => ({ ...prev, district: suggestion.name, ward: '' }));
            form.setFieldsValue({ district: suggestion.name }); // Cập nhật Form
            setSelectedDistrictId(suggestion.id);
        } else if (field === 'ward') {
            setNewAddress((prev) => ({ ...prev, ward: suggestion.name }));
            form.setFieldsValue({ ward: suggestion.name }); // Cập nhật Form
        }

        setSuggestions([]);
        setActiveField(''); // Ẩn gợi ý sau khi chọn
    };

    useEffect(() => {
        if (isVisible) {
            form.setFieldsValue({ city: '', district: '', ward: '', street: '' }); // Reset giá trị form khi mở lại
            setNewAddress({ city: '', district: '', ward: '', street: '' }); // Reset state
            setSelectedCityId(null);
            setSelectedDistrictId(null);
        }
    }, [isVisible, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // Kiểm tra tính hợp lệ của toàn bộ Form
            onOk(values); // Gửi giá trị hợp lệ lên component cha
            form.resetFields(); // Reset Form
        } catch (error) {
            console.error('Lỗi khi kiểm tra Form:', error);
        }
    };

    return (
        <Modal title="Thêm địa chỉ mới" open={isVisible} onOk={handleOk} onCancel={onCancel}>
            <Form form={form} layout="vertical" initialValues={newAddress}>
                <div style={{ position: 'relative' }}>
                    <Spin spinning={isLoadingProvince}>
                        <Form.Item
                            label="Thành phố"
                            name="city"
                            rules={[
                                { required: true, message: 'Vui lòng nhập thành phố!' },
                            ]}
                        >
                            <Input
                                onClick={() => handleInputClick('city')}
                                onChange={(e) => handleInputChange(e, 'city')}
                                placeholder="Nhập thành phố"
                                disabled={isLoadingProvince} // Disable khi đang tải
                            />
                        </Form.Item>
                    </Spin>
                    {activeField === 'city' && suggestions.length > 0 && (
                        <div className="suggestion-list">
                            {suggestions.map((item) => (
                                <div
                                    key={item.id}
                                    className="suggestion-list-item"
                                    onClick={() => handleSuggestionClick(item, 'city')}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <Spin spinning={isLoadingDistrict}>
                        <Form.Item
                            label="Quận/Huyện"
                            name="district"
                            rules={[
                                { required: true, message: 'Vui lòng nhập quận/huyện!' },
                            ]}
                        >
                            <Input
                                onClick={() => handleInputClick('district')}
                                onChange={(e) => handleInputChange(e, 'district')}
                                placeholder="Nhập quận/huyện"
                                disabled={!selectedCityId || isLoadingDistrict} // Disable khi không có city hoặc đang tải
                            />
                        </Form.Item>
                    </Spin>
                    {activeField === 'district' && suggestions.length > 0 && (
                        <div className="suggestion-list">
                            {suggestions.map((item) => (
                                <div
                                    key={item.id}
                                    className="suggestion-list-item"
                                    onClick={() => handleSuggestionClick(item, 'district')}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <Spin spinning={isLoadingWard}>
                        <Form.Item
                            label="Phường/Xã"
                            name="ward"
                            rules={[
                                { required: true, message: 'Vui lòng nhập phường/xã!' },
                            ]}
                        >
                            <Input
                                onClick={() => handleInputClick('ward')}
                                onChange={(e) => handleInputChange(e, 'ward')}
                                placeholder="Nhập phường/xã"
                                disabled={!selectedDistrictId || isLoadingWard} // Disable khi không có district hoặc đang tải
                            />
                        </Form.Item>
                    </Spin>
                    {activeField === 'ward' && suggestions.length > 0 && (
                        <div className="suggestion-list">
                            {suggestions.map((item) => (
                                <div
                                    key={item.id}
                                    className="suggestion-list-item"
                                    onClick={() => handleSuggestionClick(item, 'ward')}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Form.Item
                    label="Đường"
                    name="street"
                    rules={[
                        { required: true, message: 'Vui lòng nhập đường!' },
                    ]}
                >
                    <Input
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="Nhập đường"
                    />
                </Form.Item>
            </Form>



        </Modal >
    );
};

export default ModalAddressForm;
