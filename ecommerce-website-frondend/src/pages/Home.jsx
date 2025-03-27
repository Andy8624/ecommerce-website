import CardContainer from "../components/CardContainer";
import CategoryComponent from "../components/CategoryComponent";
import ImageSlider from "../components/ImageSlider";
import SectionTitle from "../components/SectionTitle";
// import WellcomeHeader from "../components/WellcomeHeader";
import ToolList from "../features/tools/components/ToolList";
// import ExampleComponent from "./ExampleComponent";

const Home = () => {
    return (
        <>
            {/* <CardContainer>
                <WellcomeHeader />
            </CardContainer> */}
            {/* <ExampleComponent /> */}

            <ImageSlider />
            <div className="p-7 bg-white">
                <SectionTitle>DANH MỤC</SectionTitle>
                <CategoryComponent />
            </div>

            <div className="p-7">
                <SectionTitle>Sản phẩm bán chạy</SectionTitle>
                <ToolList pageSize={12} />
            </div>


            <CardContainer>
                <SectionTitle>Sản phẩm liên quan</SectionTitle>
                <ToolList pageSize={12} />
            </CardContainer>
        </>
    );
};

export default Home;
