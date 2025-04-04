import { Button } from 'antd';

const CartSummary = ({ total, length, onCheckout, isDisabled }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t p-4">
            <div className="w-[77%] mx-auto">
                <div className="flex justify-between text-xl">
                    <span className="font-semibold">Tổng cộng: </span>
                    <div>
                        <span className="mr-5">({length} sản phẩm)</span>
                        <span>{total.toLocaleString()} VND</span>
                    </div>
                </div>
                <Button
                    type="primary"
                    className="w-full mt-4 py-2 text-lg text-[var(--gold-light)] bg-[var(--primary-color)]"
                    disabled={isDisabled}
                    onClick={onCheckout}
                >
                    Thanh toán
                </Button>
            </div>
        </div >
    );
};

export default CartSummary;
