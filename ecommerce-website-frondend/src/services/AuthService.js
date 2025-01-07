import axios from "./axios-customize"

export const login = (email, password) => {
    return axios.post(`/api/v1/auth/login`, { email, password });
}

export const getAccount = () => {
    const path = `/api/v1/auth/account`;
    const res = axios.get(path);
    // console.log(res);
    return res;

}

export const checkEmailExists = async (email) => {
    return axios.get(`/api/v1/auth/check-email/${email}`);
};