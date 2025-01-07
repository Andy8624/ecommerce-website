import axios from "./axios-customize"

export const callGetAllCourse = async () => {
    const path = "/api/v1/courses";
    const res = await axios.get(path);
    return res?.data;
}

export const callCreateCourse = async (data) => {
    const path = "/api/v1/courses";
    const res = await axios.post(path, data);
    return res?.data;
}

export const callUpdateCourse = async (data, courseId) => {
    const path = `/api/v1/courses/${courseId}`;
    const res = await axios.put(path, data)
    return res?.data;
}

export const callDeleteCourse = async (courseId) => {
    const path = `/api/v1/courses/${courseId}`;
    const res = await axios.delete(path);
    return res?.data;
}

export const callGetAllCourseByUserId = async (userId) => {
    const path = `/api/v1/courses/ownerByUser/${userId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callGetCourseByCourseId = async (courseId) => {
    const path = `/api/v1/courses/${courseId}`;
    const res = await axios.get(path);
    // console.log(res?.data);
    return res?.data;
}

// export const callGetCourseDBByCourseUrl = async (courseUrl) => {
//     const path = `/api/v1/courses/courseUrl`;
//     const res = await axios.post(path, courseUrl);
//     console.log(res);
//     return res?.data;
// }