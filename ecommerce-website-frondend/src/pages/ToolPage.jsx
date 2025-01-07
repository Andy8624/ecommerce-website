import CardContainer from "../components/CardContainer"
import ToolList from "../features/tools/components/ToolList"


const ToolPage = () => {
    return (
        <div className="pt-1">
            <CardContainer>
                <ToolList pageSize={10} />
            </CardContainer>
        </div>
    )
}

export default ToolPage