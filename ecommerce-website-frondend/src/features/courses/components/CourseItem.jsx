// CourseItem.js
import { Card } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/LoginModal";
import CourseOverlay from "./CourseOvelay";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Meta } = Card;

const CourseItem = ({ course }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const userId = useSelector(state => state?.account?.user?.id);
    // const user = useSelector(state => state?.account?.user);
    // console.log(user);

    // thực hiện thêm khóa học vào giỏ hàng tại đây

    const onAddToCartClick = () => {
        if (userId == undefined || userId == null || userId == "") {
            return setIsModalVisible(true);
        }

        toast.warn("Chức năng đang phát triển, vui lòng thử lại sau");

    };



    const navigateToDetailPage = () => {
        navigate("/course-detail", { state: { course: course } });
    };

    return (
        <>
            <Card
                className="relative transition-transform duration-100 shadow-md"
                hoverable
                onMouseEnter={() => setIsPopoverVisible(true)}
                onMouseLeave={() => setIsPopoverVisible(false)}
                cover={
                    <div className="h-52 w-full overflow-hidden">
                        <img
                            alt={course.playlistDetails.title}
                            src={course.playlistDetails.thumbnail}
                            className="h-full w-full object-cover transform scale-150 cursor-pointer"
                            onClick={navigateToDetailPage}
                        />
                    </div>

                }
            >
                <Meta
                    style={{ height: '14vh' }}
                    title={
                        <span
                            className="text-base cursor-pointer text-two-lines"
                            onClick={navigateToDetailPage}
                        >
                            {course.playlistDetails.title}
                        </span>
                    }
                    description={
                        <div className="text-sm" onClick={navigateToDetailPage}>
                            <div className="text-red-500 font-semibold">
                                {course.discountedPrice !== 0 ? (
                                    <>
                                        <span className="text-gray-500 line-through">
                                            {course.price.toLocaleString()}₫
                                        </span>{" "}
                                        {course.discountedPrice.toLocaleString()}₫
                                    </>
                                ) : (
                                    <>
                                        {course.price.toLocaleString()}₫
                                    </>
                                )}
                            </div>
                        </div>
                    }
                />

                {isPopoverVisible && (
                    <CourseOverlay
                        onAddToCartClick={onAddToCartClick}
                        name={course.playlistDetails.title}
                        duration={course.playlistDetails.totalDuration}
                        totalVideos={course.playlistDetails.videoCount}
                        description={course.playlistDetails.description}
                        updatedAt={course.updatedAt}
                        publishedAt={course.playlistDetails.publishedAt}
                        course={course}
                        navigateToDetailPage={navigateToDetailPage}
                    // price={course.price}
                    // discountedPrice={course.discountedPrice}
                    />
                )}
            </Card>

            <LoginModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />
        </>
    );
};

export default CourseItem;
