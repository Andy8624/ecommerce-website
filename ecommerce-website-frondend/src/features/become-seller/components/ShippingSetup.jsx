import { useEffect, useState } from 'react';
import { Button, Collapse, Switch } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useShippingMethod, useUpdateShippingMethod } from '../hooks/useShippingMethod';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

const ShippingSetup = ({ next, prev }) => {
    const [enabledGHN, setEnabledGHN] = useState(false);
    const [enabledGHTK, setEnabledGHTK] = useState(false);
    const userId = useSelector((state) => state.account?.user?.id);
    const { updateShippingMethod, isUpdating } = useUpdateShippingMethod();
    const { shippingMethod } = useShippingMethod(userId);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (shippingMethod) {
            setEnabledGHN(shippingMethod?.GHN?.enabled);
            setEnabledGHTK(shippingMethod?.GHTK?.enabled);
        }
        setDisabled(shippingMethod?.GHTK?.enabled || shippingMethod?.GHN?.enabled);
    }, [shippingMethod]);



    const handleToggleFast = (checked) => {
        setEnabledGHN(checked);
    };

    const handleToggleEco = () => {
        setEnabledGHTK(true);
        toast.warning("Tính năng đang phát triển!");
        setTimeout(() => {
            setEnabledGHTK(false);
        }, 500);
    };

    const queryClient = useQueryClient();

    const handleSave = async () => {
        if (!(enabledGHN || enabledGHTK)) {
            toast.warning("Vui lòng chọn ít nhất 1 phương thức vận chuyển");
        } else {
            const shippingData = {
                GHN: { enabled: enabledGHN },
                GHTK: { enabled: enabledGHTK }
            };
            await updateShippingMethod({ data: shippingData, userId });
            queryClient.invalidateQueries(["users", userId]);
            setDisabled(true);
        }

    };

    const handleNext = async () => {
        await handleSave();
        next();
    };

    const items = [
        {
            key: '1',
            label: 'Giao hàng nhanh',
            children: (
                <div className="flex justify-between items-center">
                    <span>
                        Kích hoạt đơn vị vận chuyển này
                        {enabledGHN && <CheckCircleTwoTone className="ms-2" twoToneColor="#52c41a" />}
                    </span>
                    <Switch checked={enabledGHN} onChange={handleToggleFast} disabled={disabled} />
                </div>
            ),
        },
        {
            key: '2',
            label: 'Giao hàng tiết kiệm',
            children: (
                <div className="flex justify-between items-center">
                    <span>
                        Kích hoạt đơn vị vận chuyển này
                        {enabledGHTK && <CheckCircleTwoTone className="ms-2" twoToneColor="#52c41a" />}
                    </span>
                    <Switch checked={enabledGHTK} onChange={handleToggleEco} disabled={disabled} />
                </div>
            ),
        },
    ];

    return (
        <div className="w-[40%] mx-auto">
            <div className="text-lg">Phương thức vận chuyển</div>
            <div className="text-sm text-gray-500 mb-3">Kích hoạt phương thức vận chuyển phù hợp</div>
            <Collapse defaultActiveKey={['1', '2']} items={items} />
            <div className="flex justify-between mt-3">
                <Button onClick={prev}>Quay lại</Button>
                <div className="flex gap-2">
                    {!disabled ?
                        <Button onClick={handleSave} type="default" loading={isUpdating}>
                            Lưu
                        </Button>
                        :
                        <Button type="default" onClick={() => setDisabled(prev => !prev)}>
                            Chỉnh sửa
                        </Button>
                    }
                    <Button type="primary" onClick={handleNext}>
                        Tiếp theo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShippingSetup;
