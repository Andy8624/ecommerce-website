import { useQuery } from "@tanstack/react-query";
import { getAddressByUserId } from "../../../services/AddressService";

export function useAddressUser(userId) {
    const { isLoading, data: addresses, error } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => getAddressByUserId(userId),
        enabled: !!userId,
    });

    return { isLoading, addresses, error };
}
