import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateAddressUser } from "../../../services/AddressService";

export function useCreateAddressUser() {
    const queryClient = useQueryClient();
    const { isPending: isCreating, mutate: createAddressUser, error } = useMutation({
        mutationFn: (address) => callCreateAddressUser(address),
        onSuccess: () => {
            queryClient.invalidateQueries("addresses");
        },
        onError: () => {
            console.log("Tạo địa chỉ thất bại");
        }
    })

    return { createAddressUser, isCreating, error };
}