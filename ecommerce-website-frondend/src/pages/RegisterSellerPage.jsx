import { useState } from 'react';
import { Steps } from 'antd';
import CardContainer from '../components/CardContainer';
import ShopInfoForm from '../features/become-seller/components/ShopInfoForm';
import CompleteRegister from '../features/become-seller/components/CompleteRegister';
import ShippingSetup from '../features/become-seller/components/ShippingSetup';
import TaxAndIdentityInfo from '../features/become-seller/components/TaxAndIdentityInfo';
import { useSelector } from 'react-redux';
import { useGetUserById } from '../hooks/useGetUserById';
import { useAddressUser } from '../hooks/useAddressUser';


const RegisterSellerPage = () => {
    const [current, setCurrent] = useState(0);
    const userId = useSelector(state => state.account?.user?.id);
    const { getUserById } = useGetUserById(userId);
    const { addresses } = useAddressUser(userId);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Thông tin Shop',
            content: <ShopInfoForm next={next} userId={userId} getUserById={getUserById} addresses={addresses} />,
        },
        {
            title: 'Cài đặt vận chuyển',
            content: <ShippingSetup next={next} prev={prev} userId={userId} />,
        },
        {
            title: 'Thông tin thuế',
            content: <TaxAndIdentityInfo next={next} prev={prev} userId={userId} addresses={addresses} getUserById={getUserById} />,
        },
        {
            title: 'Hoàn tất',
            content: <CompleteRegister />,
        },
    ];

    return (
        <CardContainer className="mx-auto w-[80%] mt-[2rem]">
            <Steps current={current} className="mb-4">
                {steps.map((item) => (
                    <Steps.Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <hr />

            <div className="p-4 rounded">
                {steps[current].content}
            </div>
        </CardContainer>
    );
};

export default RegisterSellerPage;