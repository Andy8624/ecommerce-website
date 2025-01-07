import axios from "./axios-customize"

export const callGetAllToolTypes = async () => {
    const path = `/api/v1/tooltypes`;
    const res = await axios.get(path);
    return res?.data?.result;
}

export const callCreateToolType = async (toolType) => {
    const path = `/api/v1/tooltypes`;
    const res = await axios.post(path, toolType);
    return res?.data;
}