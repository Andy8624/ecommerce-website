import { useCalculateShippingCost } from "../features/checkout/hooks/orders/useShippingCost";

const ExampleComponent = () => {
    const shippingData = {
        "service_type_id": 2,
        "from_district_id": 1442,
        "from_ward_code": "21211",
        "to_district_id": 1820,
        "to_ward_code": "030712",
        "length": 30,
        "width": 40,
        "height": 20,
        "weight": 3000,
        "insurance_value": 0,
        "coupon": null,
        "items": [
            {
                "name": "TEST1",
                "quantity": 10,
                "length": 200,
                "width": 200,
                "height": 200,
                "weight": 1000
            }]
    };

    const shopId = "195774"; // Shop ID của bạn
    const { shippingCost, isLoading, error } = useCalculateShippingCost(shippingData, shopId);

    if (isLoading) {
        return <div>Loading shipping cost...</div>;
    }

    if (error) {
        return <div>Error calculating shipping cost: {error.message}</div>;
    }

    return (
        <div>
            <h3>Shipping Cost:</h3>
            <p>{shippingCost?.total || "N/A"} VND</p>
        </div>
    );
};

export default ExampleComponent;
