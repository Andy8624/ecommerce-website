import { useQuery } from "@tanstack/react-query";
import { callPaymentMethod } from "../../../services/PaymentMethodService";

export function useGetAllPaymentMethod() {
    const { isLoading, data: paymentMethods } = useQuery({
        queryKey: ["paymentMethods"],
        queryFn: callPaymentMethod,
    })

    return { isLoading, paymentMethods };

}