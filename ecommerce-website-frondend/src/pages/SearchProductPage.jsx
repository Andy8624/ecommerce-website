import CardContainer from "../components/CardContainer"
import ToolListSearch from "../features/tools/components/ToolListSearch"

const SearchProductPage = () => {
    const searchData = [];
    const results = JSON.parse(localStorage.getItem('results-image-search'));
    if (results) {
        results.forEach((result) => {
            searchData.push(result?.toolId);
        });
    }

    return (
        <div className="pt-1">
            <CardContainer>
                <ToolListSearch pageSize={12} toolData={searchData} />
            </CardContainer>
        </div>
    )
}

export default SearchProductPage