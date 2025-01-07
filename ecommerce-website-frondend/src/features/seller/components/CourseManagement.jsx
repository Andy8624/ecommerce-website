import { Button } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import CourseTable from "./CourseTable";
import CourseForm from "./CourseForm";
import { useCreateCourse } from "../hooks/useCreateCourse";
import { callCheckUrlExistInDb, checkIfPlaylistExists, getPlaylistId } from "../../../services/YoutubeService";
import { toast } from "react-toastify";
import { useUpdateCourse } from "../hooks/useUpdateCourse";
import { useDeleteCourse } from "../hooks/useDeleteCourse";
import { useGetAllCourseByUserId } from "../hooks/useGetAllCourseByUserId";

const CourseManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { courses: courseDB, isLoading: isLoadingCourseDB } = useGetAllCourseByUserId(userId);
    const courseData = courseDB?.result || null;

    const { createCourse, isCreatingCourse } = useCreateCourse();

    const handleCreateCourse = async (newCourse) => {

        const checkExistInYoutube = await checkIfPlaylistExists(newCourse.courseUrl)
        if (checkExistInYoutube == false) {
            toast.error("Playlist url không tồn tại");
            return;
        } else {
            const checkExistInDb = await callCheckUrlExistInDb(getPlaylistId(newCourse.courseUrl))
            // console.log(checkExistInDb)
            if (checkExistInDb != null) {
                toast.error("Playlist url đã tồn tại");
                return;
            }
            const data = {
                ...newCourse,
                userId,
            }
            createCourse(data, {
                onSuccess: () => {
                    setIsModalVisible(false);
                    toast.success("Thêm khóa học thành công")
                },
                onError: () => {
                    toast.error("Có lỗi xảy ra khi tạo khóa học");
                }
            });
        }
    };

    const { updateCourse } = useUpdateCourse();

    const handleUpdateCourse = (updatedCourse) => {
        const data = {
            courseUrl: updatedCourse.courseUrl,
            discountedPrice: updatedCourse.discountedPrice,
            price: updatedCourse.price
        };
        const courseId = updatedCourse.courseId;
        updateCourse({ data, courseId }, {
            onSuccess: () => {
                toast.success("Cập nhật khóa học thành công")
                setIsModalVisible(false);
            }
        })
    };

    const { deleteCourse } = useDeleteCourse();
    const handleDeleteCourse = (courseId) => {
        deleteCourse(courseId)
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setIsModalVisible(true);
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setIsModalVisible(true);
    };
    return (
        <div className="p-3">
            <h1 className="text-2xl font-semibold mb-3 text-center">Quản lý khóa học</h1>
            <Button onClick={openCreateModal} type="primary" className="mb-3">
                Thêm khóa học
            </Button>
            <CourseTable
                courses={courseData}
                onEdit={handleEdit}
                onDelete={handleDeleteCourse}
                isLoading={isLoadingCourseDB}
            />
            <CourseForm
                userId={userId}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
                editingCourse={editingCourse}
                isCreatingCourse={isCreatingCourse}
            />
        </div>
    );
};

export default CourseManagement;
