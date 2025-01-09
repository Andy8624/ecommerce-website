import { useQuery } from "@tanstack/react-query";
import { callWardFromGHN, callDistrictFromGHN, callProvinceFromGHN } from "../../../../services/GHNService";

export function useProviceFromGHN() {
    const { isLoading: isLoadingProvince, data: province, error: errorProvince } = useQuery({
        queryKey: ["provinces"],
        queryFn: () => callProvinceFromGHN(),
    });

    return { isLoadingProvince, province, errorProvince };
}

export function useDistrictFromGHN(cityId) {
    const { isLoading: isLoadingDistrict, data: districts, error: errorDistrict } = useQuery({
        queryKey: ["districts", cityId],
        queryFn: () => callDistrictFromGHN(cityId),
        enabled: !!cityId, // Chỉ gọi API khi `cityId` có giá trị
    });

    return { isLoadingDistrict, districts, errorDistrict };
}

export function useWardFromGHN(districtId) {
    const { isLoading: isLoadingWard, data: wards, error: errorWard } = useQuery({
        queryKey: ["wards", districtId],
        queryFn: () => callWardFromGHN(districtId),
        enabled: !!districtId, // Chỉ gọi API khi `districtId` có giá trị
    });

    return { isLoadingWard, wards, errorWard };
}
