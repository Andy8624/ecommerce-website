import { useQuery } from "@tanstack/react-query";
import { callCalculateShippingCost, callDistrictFromGHN, callProvinceFromGHN, callWardFromGHN } from "../../../../services/GHNService";

export function useGetProvinceIdByName(provinceName) {
    const { data: provinces, isLoading, error } = useQuery({
        queryKey: ["provinces"],
        queryFn: callProvinceFromGHN,
    });

    const provinceId = provinces?.find(
        (p) => p.ProvinceName.toLowerCase() === provinceName.toLowerCase()
    )?.ProvinceID;

    return { provinceId, isLoading, error };
}

export function useGetDistrictIdByName(provinceId, districtName) {
    const { data: districts, isLoading, error } = useQuery({
        queryKey: ["districts", provinceId],
        queryFn: () => callDistrictFromGHN(provinceId),
        enabled: !!provinceId,
    });

    const districtId = districts?.find(
        (d) => d.DistrictName.toLowerCase() === districtName.toLowerCase()
    )?.DistrictID;

    return { districtId, isLoading, error };
}

export function useGetWardCodeByName(districtId, wardName) {
    const { data: wards, isLoading, error } = useQuery({
        queryKey: ["wards", districtId],
        queryFn: () => callWardFromGHN(districtId),
        enabled: !!districtId,
    });

    const wardCode = wards?.find(
        (w) => w.WardName.toLowerCase() === wardName.toLowerCase()
    )?.WardCode;

    return { wardCode, isLoading, error };
}

export function useCalculateShippingCost(data, shopId) {
    // const shippingData = {
    //     "service_type_id": 2,
    //     "from_district_id": 1442,
    //     "from_ward_code": "21211",
    //     "to_district_id": 1820,
    //     "to_ward_code": "030712",
    //     "length": 30,
    //     "width": 40,
    //     "height": 20,
    //     "weight": 3000,
    //     "insurance_value": 0,
    //     "coupon": null,
    //     "items": [
    //         {
    //             "name": "TEST1",
    //             "quantity": 10,
    //             "length": 200,
    //             "width": 200,
    //             "height": 200,
    //             "weight": 1000
    //         }]
    // };

    const { data: shippingCost, isLoading, error } = useQuery({
        queryKey: ["shipping-cost", data, shopId],
        queryFn: () => callCalculateShippingCost(data, shopId),
        enabled: !!data?.from_district_id && !!data?.to_district_id && !!data?.to_ward_code && !!shopId,
    });

    return { shippingCost, isLoading, error };
}