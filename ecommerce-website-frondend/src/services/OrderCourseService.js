import axios from "./axios-customize"

export const callCreateOrderCourse = async (orderCourse) => {
    const path = `/api/v1/ordercourses`;
    const res = await axios.post(path, orderCourse);
    return res?.data;
}

export const callGetOrderCourseByOrderId = async (orderId) => {
    const path = `/api/v1/ordercourses/order/${orderId}`;
    const res = await axios.get(path);
    return res?.data?.result;
}

export const callGetOrderCourseByCourseId = async (courseId) => {
    const path = `/api/v1/ordercourses/course/${courseId}`;
    const res = await axios.get(path);
    // console.log(res?.data);
    return res?.data?.result;
}

export const callGetOrderCourseByUserId = async (userId) => {
    const path = `/api/v1/ordercourses/user/${userId}`;
    const res = await axios.get(path);
    return res?.data?.result;
}