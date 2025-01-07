const CardContainer = ({ children }) => {
    return (
        <div className="px-4 py-4 bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6">
                {children}
            </div>
        </div>
    );
};

export default CardContainer;
