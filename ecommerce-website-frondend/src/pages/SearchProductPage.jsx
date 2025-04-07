import ToolListSearch from "../features/tools/components/ToolListSearch"

const SearchProductPage = () => {
    return (
        <div className="p-8">
            <ToolListSearch pageSize={12} />
        </div>
    )
}

export default SearchProductPage