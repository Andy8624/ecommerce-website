const CardContainer = ({ children, className }) => {
    return (
        <div className={`bg-gray-100 mx-6 my-4 ${className}`} >
            <div className="bg-white rounded-lg shadow-md p-6">
                {children}
            </div>
        </div >
    );
};

export default CardContainer;
