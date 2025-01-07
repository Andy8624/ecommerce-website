import axios from "./axios-customize"

export const getAddressByUserId = async (id) => {
    const path = `/api/v1/addresses/user-address/${id}`;
    const res = await axios.get(path);
    return res?.data?.result;
}

export const callCreateAddressUser = async (address) => {
    const path = `/api/v1/addresses`;
    const res = await axios.post(path, address);
    return res?.data?.result;
}