import { useMutation } from "@tanstack/react-query";
import { callCalculateShippingCost } from "../services/GHNService";
import { getAddressById } from "../services/AddressService";

// từ sản phẩm lấy ra địa chỉ của chủ shop
// tạo dữ liệu để lấy phí ship

const useShippingCostMutation = () => {
    const {
        mutateAsync: calculateShippingCostAsync,
        isLoading: isCalculatingShippingCost,
        error,
    } = useMutation({
        mutationFn: async ({ products, buyerAddress }) => {
            const shopAddressId = products[0]?.ownerUser?.shopAddressId;
            const shopAddress = await getAddressById(shopAddressId);
            // console.log("shopAddress", shopAddress);
            // console.log("products", products);
            // console.log("buyerAddress", buyerAddress);

            // tong tong trong luong, cao, rong, dai cua san pham
            const toolListAttr = products
                .map((product) => {
                    return {
                        length: product?.length,
                        width: product?.width,
                        height: product?.height,
                        weight: product?.weight,
                    };
                })
                .reduce(
                    (acc, curr) => {
                        return {
                            length: acc.length + curr.length,

                            width: acc.width + curr.width,

                            height: acc.height + curr.height,
                            weight: acc.weight + curr.weight,
                        };
                    },
                    { length: 0, width: 0, height: 0, weight: 0 }
                );
            // console.log("toolList", toolListAttr);
            // lay danh sach san pham
            const items = products.map((product) => {
                return {
                    name: product?.name,
                    quantity: product?.quantity,
                    length: product?.length,
                    width: product?.width,
                    height: product?.height,
                    weight: product?.weight,
                };
            });

            return callCalculateShippingCost({
                "service_type_id": 2,
                "from_province": shopAddress?.city,
                "from_district": shopAddress?.district,
                "from_ward": shopAddress?.ward,
                "to_province": buyerAddress?.city,
                "to_district": buyerAddress?.district,
                "to_ward": buyerAddress?.ward,
                "length": toolListAttr?.length,
                "width": toolListAttr?.width,
                "height": toolListAttr?.height,
                "weight": toolListAttr?.weight,
                "insurance_value": 0,
                "items": items,
            })
        },
    });

    return {
        calculateShippingCostAsync,
        isCalculatingShippingCost,
        error,
    };
};

export default useShippingCostMutation;
