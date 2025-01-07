import axios from "./axios-customize"

export const callPaymentMethod = async () => {
    const path = `/api/v1/paymentmethods`;
    const res = await axios.get(path);
    return res?.data?.result;
}
