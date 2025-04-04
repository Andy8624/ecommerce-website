import { Button } from 'antd';

const CheckoutSummary = ({ totalAmount, shipCost, onConfirm }) => {
    const finalAmount = totalAmount + shipCost;

    return (
        <div className="flex justify-end bg-white rounded-lg py-5 shadow-md mt-3 shadow-xl ">
            <div className="pr-[2.5rem] text-left w-[35%]">
                <div className="flex justify-between">
                    <p className="text-[1rem]">Tổng tiền hàng:</p>
                    <p className="text-gray-600">
                        ₫{totalAmount?.toLocaleString()}
                    </p>
                </div>
                <br />

                <div className="flex justify-between">
                    <p className="text-[1rem]">Tổng phí vận chuyển:</p>
                    <p className="text-gray-600">
                        ₫{shipCost?.toLocaleString()}
                    </p>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between">
                    <p className="text-[1rem]">Tổng thanh toán:</p>
                    <p className="text-red-700 text-[1rem]">
                        ₫{finalAmount?.toLocaleString()}
                    </p>
                </div>

                <div className="mt-4">
                    <Button
                        type="primary"
                        onClick={onConfirm}
                        className="w-full rounded-lg py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md"
                    >
                        Xác nhận thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;