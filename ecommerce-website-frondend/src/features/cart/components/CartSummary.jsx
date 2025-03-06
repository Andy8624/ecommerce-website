import { Button } from 'antd';

const CartSummary = ({ total, onCheckout, isDisabled }) => {
    return (
        <div className="mt-4 border-t pt-6">
            <div className="flex justify-between text-xl font-semibold">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()} VND</span>
            </div>
            <Button
                type="primary"
                className="w-full mt-6 py-2 text-lg text-[var(--gold-light)] bg-[var(--primary-color)]"
                disabled={isDisabled}
                onClick={onCheckout}
            >
                Thanh toán
            </Button>
        </div>
    );
};

export default CartSummary;
