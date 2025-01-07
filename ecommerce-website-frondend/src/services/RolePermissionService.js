import axios from "./axios-customize"

export const getPermissionOfRole = (roleId) => {
    return axios.get(`/api/v1/roles-permissions/role-owner/${roleId}`);
}