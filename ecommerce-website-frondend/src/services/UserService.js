import axios from './axios-customize';

export const callGetUserByUserId = async (userId) => {
    const res = await axios.get(`/api/v1/users/${userId}`);
    return res?.data;
}

export const callUpdateUserRoleByUserId = async (data) => {
    const res = await axios.post(`/api/v1/users/user-role`, data);
    console.log(res);
    return res?.data;
}
