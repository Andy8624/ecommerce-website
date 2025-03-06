const CardContainer = ({ children, className }) => {
    return (
        <div className={` mx-6 my-4 ${className}`} >
            <div className="bg-white rounded-lg shadow-xl p-6">
                {children}
            </div>
        </div >
    );
};

export default CardContainer;
