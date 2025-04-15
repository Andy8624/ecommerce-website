import axios_customize from "./axios-customize"
export const getAddressByUserId = async (id) => {
    const path = `/api/v1/addresses/user-address/${id}`;
    const res = await axios_customize.get(path);
    return res?.data?.result;
}

export const getAddressById = async (id) => {
    const path = `/api/v1/addresses/${id}`;
    const res = await axios_customize.get(path);
    return res?.data;
}

export const callCreateAddressUser = async (address) => {
    const path = `/api/v1/addresses`;
    const res = await axios_customize.post(path, address);
    return res?.data?.result;
}

export const callDeleteAddressUser = async (id) => {
    const path = `/api/v1/addresses/${id}`;
    const res = await axios_customize.delete(path);
    return res?.data;
}
