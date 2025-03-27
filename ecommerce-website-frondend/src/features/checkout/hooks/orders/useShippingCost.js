import { useQuery } from "@tanstack/react-query";
import { callDistrictFromGHN, callProvinceFromGHN, callWardFromGHN } from "../../../../services/GHNService";

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
