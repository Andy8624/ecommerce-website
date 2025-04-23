import CategoryComponent from "../components/CategoryComponent";
import ImageSlider from "../components/ImageSlider";
import SectionTitle from "../components/SectionTitle";
import ToolList from "../features/tools/components/ToolList";
import ToolListUBCF from "../features/tools/components/ToolListUBCF";
import { ReloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ToolListCBF from "../features/tools/components/ToolListCBF";


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


            <div className="px-7 mt-7">
                <ToolListCBF pageSize={12} />
            </div>

            <div className="p-7">
                <div className="flex justify-between items-center mb-4">
                    <SectionTitle>Có thể bạn cũng thích</SectionTitle>
                    <button
                        onClick={refreshRecommendations}
                        className="flex items-center px-3 py-1 bg-[var(--primary-color)] text-white rounded hover:bg-white hover:text-[var(--primary-color)] transition hover:shadow-md hover:border hover:border-[var(--primary-color)]"
                    >
                        <ReloadOutlined className="mr-2" /> Làm mới
                    </button>
                </div>
                <ToolListUBCF pageSize={12} />
            </div>

            <div className="px-7 pb-7">
                <SectionTitle>Sản phẩm bán chạy</SectionTitle>
                <ToolList pageSize={12} />
            </div>
        </>
    );
};

export default Home;
