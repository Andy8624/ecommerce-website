import { Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Nhập axios

const { Option } = Select;

const ModalAddressForm = ({ isVisible, onOk, onCancel }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [newAddress, setNewAddress] = useState({
        street: '',
        ward: '',
        district: '',
        city: '',
    });

    // Thêm trạng thái để lưu tên
    const [selectedCityName, setSelectedCityName] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

    useEffect(() => {
        fetchCities(); // khi render lần đầu thì bắt đầu lấy dữ liệu thành phố
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
            setCities(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy thành phố:', error);
        }
    };

    const fetchDistricts = async (cityId) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`); // Cập nhật URL API cho quận
            setDistricts(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy quận/huyện:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`); // Cập nhật URL API cho phường
            setWards(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy phường/xã:', error);
        }
    };

    const handleCityChange = (value) => {
        const selectedCity = cities.find(city => city.id === value);
        setSelectedCityName(selectedCity ? selectedCity.name : ''); // Cập nhật tên thành phố
        setNewAddress((prev) => ({ ...prev, city: value, district: '', ward: '' }));
        fetchDistricts(value); // Lấy quận khi thành phố được chọn
    };

    const handleDistrictChange = (value) => {
        const selectedDistrict = districts.find(district => district.id === value);
        setSelectedDistrictName(selectedDistrict ? selectedDistrict.name : ''); // Cập nhật tên quận
        setNewAddress((prev) => ({ ...prev, district: value, ward: '' }));
        fetchWards(value); // Lấy phường khi quận được chọn
    };

    const handleWardChange = (value) => {
        const selectedWard = wards.find(ward => ward.id === value);
        setSelectedWardName(selectedWard ? selectedWard.name : ''); // Cập nhật tên phường
        setNewAddress((prev) => ({ ...prev, ward: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleOk = () => {
        // Tạo địa chỉ hoàn chỉnh
        const completeAddress = {
            street: newAddress.street,
            ward: selectedWardName,
            district: selectedDistrictName,
            city: selectedCityName,
        };
        onOk(completeAddress); // Gửi địa chỉ hoàn chỉnh lên component cha
        setNewAddress({ street: '', ward: '', district: '', city: '' });
        setSelectedCityName('');
        setSelectedDistrictName('');
        setSelectedWardName('');
    };

    return (
        <Modal title="Thêm địa chỉ mới" open={isVisible} onOk={handleOk} onCancel={onCancel}>
            <Form layout="vertical">
                <Form.Item label="Thành phố">
                    <Select value={newAddress.city} onChange={handleCityChange} placeholder="Chọn thành phố">
                        {cities.map(city => <Option key={city.id} value={city.id}>{city.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Quận/Huyện">
                    <Select value={newAddress.district} onChange={handleDistrictChange} placeholder="Chọn quận/huyện">
                        {districts.map(district => <Option key={district.id} value={district.id}>{district.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Phường/Xã">
                    <Select value={newAddress.ward} onChange={handleWardChange} placeholder="Chọn phường/xã">
                        {wards.map(ward => <Option key={ward.id} value={ward.id}>{ward.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Đường">
                    <Input name="street" value={newAddress.street} onChange={handleChange} placeholder="Nhập đường" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAddressForm;
