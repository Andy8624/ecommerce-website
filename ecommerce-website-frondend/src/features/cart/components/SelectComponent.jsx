import { Select } from 'antd';

const SelectComponent = ({ onSelectType }) => (
    <Select
        defaultValue="all"
        style={{
            width: 120,
        }}
        onChange={onSelectType}
        options={[
            {
                value: 'all',
                label: 'Tất cả',
            },
            {
                value: 'product',
                label: 'Dụng cụ',
            }
        ]}
    />
);
export default SelectComponent;