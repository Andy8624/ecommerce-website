import CategoryComponent from "../components/CategoryComponent";
import ImageSlider from "../components/ImageSlider";
import SectionTitle from "../components/SectionTitle";
import ToolList from "../features/tools/components/ToolList";
import ToolListUBCF from "../features/tools/components/ToolListUBCF";
import { ReloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";


const Home = () => {
    const queryClient = useQueryClient();
    const user = useSelector(state => state.account?.user);

    // Function to refresh recommendations
    const refreshRecommendations = () => {
        if (user?.id) {
            queryClient.invalidateQueries({
                queryKey: ['userRecommendations', user.id]
            });
        }
    };

    return (
        <>
            <ImageSlider />
            <div className="p-7 bg-white">
                <SectionTitle>DANH MỤC</SectionTitle>
                <CategoryComponent />
            </div>

            <div className="p-7">
                <div className="flex justify-between items-center mb-4">
                    <SectionTitle>Gợi ý cho bạn</SectionTitle>
                    <button
                        onClick={refreshRecommendations}
                        className="flex items-center px-3 py-1 bg-[var(--primary-color)] text-white rounded hover:bg-white hover:text-[var(--primary-color)] transition hover:shadow-md hover:border hover:border-[var(--primary-color)]"
                    >
                        <ReloadOutlined className="mr-2" /> Làm mới
                    </button>
                </div>
                <ToolListUBCF pageSize={18} />
            </div>

            <div className="p-7">
                <SectionTitle>Sản phẩm bán chạy</SectionTitle>
                <ToolList pageSize={18} />
            </div>
        </>
    );
};

export default Home;
