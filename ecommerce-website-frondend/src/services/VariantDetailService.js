import axios from "./axios-customize"

export const callGetVariantDetailById = async (id) => {
    const path = `/api/v1/variant-detail/${id}`;
    const res = await axios.get(path);
    return res?.data;
}