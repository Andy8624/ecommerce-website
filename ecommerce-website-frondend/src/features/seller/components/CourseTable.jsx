import { Table, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { fetchPlaylistTitle } from "../../../services/YoutubeService";

const CourseTable = ({ courses = [], onEdit, onDelete, isLoading }) => {
    const [playlistTitles, setPlaylistTitles] = useState({});

    useEffect(() => {
        const loadTitles = async () => {
            const titles = {};
            courses?.map(async (course) => {
                if (course.courseUrl && !playlistTitles[course.courseUrl]) {
                    const title = await fetchPlaylistTitle(course.courseUrl);
                    titles[course.courseUrl] = title || "Không thể lấy tên";
                }
            })
            setPlaylistTitles(titles);
        };

        loadTitles();
    }, [courses]);

    const columns = [
        {
            title: "URL playlist youtube",
            dataIndex: "courseUrl",
            key: "courseUrl",
            align: "center",
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {/* {playlistTitles[text] || "Đang tải..."} */}
                    {text}
                </a>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            align: "center",
            render: (text) => `${text.toLocaleString()}đ`
        },
        {
            title: "Giá khuyến mãi",
            dataIndex: "discountedPrice",
            key: "discountedPrice",
            align: "center",
            render: (text) => text ? `${text.toLocaleString()}đ` : "Không có"
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (text, course) => (
                <div className="flex justify-center items-center space-x-2">
                    <Button onClick={() => onEdit(course)} className="bg-green-500 hover:bg-green-600 text-white">
                        Sửa
                    </Button>
                    <Button onClick={() => onDelete(course.courseId)} className="bg-red-500 hover:bg-red-600 text-white">
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Spin spinning={isLoading} tip="Đang tải thông tin khóa học">
            <Table
                className="shadow-lg"
                dataSource={courses}
                rowKey="courseId"
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </Spin>
    );
};

export default CourseTable;
