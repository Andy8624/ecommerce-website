import CardContainer from "../components/CardContainer"
import CourseList from "../features/courses/components/CourseList"


const CoursePage = () => {
    return (
        <div className="pt-1">
            <CardContainer>
                <CourseList pageSize={10} />
            </CardContainer>
        </div>
    )
}

export default CoursePage