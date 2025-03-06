import CardContainer from "../components/CardContainer";
// import ImageSlider from "../components/ImageSlider";
import SectionTitle from "../components/SectionTitle";
// import WellcomeHeader from "../components/WellcomeHeader";
// import CourseList from "../features/courses/components/CourseList";
import ToolList from "../features/tools/components/ToolList";
// import ExampleComponent from "./ExampleComponent";

const Home = () => {
    return (
        <>
            {/* <CardContainer>
                <WellcomeHeader />
            </CardContainer> */}
            {/* <ExampleComponent /> */}

            {/* <ImageSlider /> */}

            <CardContainer>
                <SectionTitle>Sản phẩm bán chạy</SectionTitle>
                <ToolList pageSize={5} />
            </CardContainer>

            <CardContainer>
                <SectionTitle>Sản phẩm liên quan</SectionTitle>
                <ToolList pageSize={5} />
            </CardContainer>
            {/* <CardContainer>
                <SectionTitle>Khóa học bán chạy</SectionTitle>
                <CourseList pageSize={5} />
            </CardContainer> */}
        </>
    );
};

export default Home;
