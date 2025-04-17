import CategoryComponent from "../components/CategoryComponent";
import ImageSlider from "../components/ImageSlider";
import SectionTitle from "../components/SectionTitle";
import ToolList from "../features/tools/components/ToolList";

const Home = () => {
    return (
        <>
            <ImageSlider />
            <div className="p-7 bg-white">
                <SectionTitle>DANH MỤC</SectionTitle>
                <CategoryComponent />
            </div>

            <div className="p-7">
                <SectionTitle>Sản phẩm bán chạy</SectionTitle>
                <ToolList pageSize={12} />
            </div>
        </>
    );
};

export default Home;
