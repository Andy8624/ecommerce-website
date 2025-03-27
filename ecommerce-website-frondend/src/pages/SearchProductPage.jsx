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
        <div className="p-8">
            <ToolListSearch pageSize={12} toolData={searchData} />
        </div>
    )
}

export default SearchProductPage