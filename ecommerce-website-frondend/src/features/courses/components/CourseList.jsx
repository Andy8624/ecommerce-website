import { useState } from "react";
import { usePlaylistsDetails } from "../hooks/usePlaylistsDetails";
import { useGetAllCourse } from "../hooks/useGetAllCourse";
import CourseItem from "./CourseItem";
import { Spin, Pagination } from "antd";

const CourseList = ({ pageSize }) => {
    const { courses, isLoadingCourses } = useGetAllCourse();
    const courseData = courses?.result;
    const { playlistsDetails, isLoading, error } = usePlaylistsDetails(courseData);
    // console.log(playlistsDetails);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    if (isLoading || isLoadingCourses) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải dữ liệu khóa học..." size="large">
                    <div />
                </Spin>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6 text-red-500">
                <span>Error: {error}</span>
            </div>
        );
    }

    if (!playlistsDetails || playlistsDetails.length === 0) {
        return (
            <div className="text-center py-6">
                <span>Không có khóa học nào.</span>
            </div>
        );
    }

    // Tính toán danh sách khóa học cho trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = playlistsDetails.slice(startIndex, endIndex);

    return (
        <div>
            {/* Danh sách khóa học */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedCourses.map((course) => (
                    <CourseItem key={course.courseId} course={course} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    current={currentPage} // Trang hiện tại
                    total={playlistsDetails.length} // Tổng số khóa học
                    pageSize={pageSize} // Số khóa học mỗi trang
                    onChange={(page) => setCurrentPage(page)} // Hàm thay đổi trang
                />
            </div>
        </div>
    );
};

export default CourseList;
