import { callDeleteAddressUser } from '../../../../services/AddressService';
import { useMutation } from '@tanstack/react-query';

export function useDeleteAddressUser() {
    const { mutate, isPending } = useMutation({
        mutationFn: (addressId) => callDeleteAddressUser(addressId),
    });

    return {
        deleteAddressUser: mutate,
        isDeleting: isPending,
    };
}