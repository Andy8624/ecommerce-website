// import axios from "./axios-customize"

// export const callGetAll = async () => {
//     const path = "/api/v1/s";
//     const res = await axios.get(path);
//     return res?.data;
// }

// export const callCreate = async (data) => {
//     const path = "/api/v1/s";
//     const res = await axios.post(path, data);
//     return res?.data;
// }

// export const callUpdate = async (data, Id) => {
//     const path = `/api/v1/s/${Id}`;
//     const res = await axios.put(path, data)
//     return res?.data;
// }

// export const callDelete = async (Id) => {
//     const path = `/api/v1/s/${Id}`;
//     const res = await axios.delete(path);
//     return res?.data;
// }

// export const callGetAllByUserId = async (userId) => {
//     const path = `/api/v1/s/ownerByUser/${userId}`;
//     const res = await axios.get(path);
//     return res?.data;
// }

// export const callGetById = async (Id) => {
//     const path = `/api/v1/s/${Id}`;
//     const res = await axios.get(path);
//     // console.log(res?.data);
//     return res?.data;
// }

// // export const callGetDBByUrl = async (Url) => {
// //     const path = `/api/v1/s/Url`;
// //     const res = await axios.post(path, Url);
// //     console.log(res);
// //     return res?.data;
// // }