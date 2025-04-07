import { Card } from "antd";
import { TOOL_URL } from "../../../utils/Config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Meta } = Card;

const ToolItem = ({ tool, similarProduct = [] }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    // console.log("tool", tool);
    // console.log("similarProduct", similarProduct);

    const realTool = similarProduct?.length == 0 ? tool : similarProduct;

    const navigateToDetailPage = () => {
        if (similarProduct?.length == 0) {
            navigate(`/tool/${realTool?.toolId}`, {
                state: {
                    realTool,
                    isSimilar: false
                }
            });
            return;
        } else {
            navigate(`/tool/${realTool?.toolId}`, {
                state: {
                    realTool,
                    isSimilar: true
                }
            });
            return;
        }
    };

    const handleGetSimilarProduct_CBF = async (toolId) => {
        navigate(`/similar-products/${toolId}`);
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card
                className="transition-transform duration-100 shadow-xl flex flex-col justify-between 
                hover:border hover:border-[var(--primary-color)] overflow-hidden hover:border-2"
                cover={
                    <div className="overflow-hidden rounded-t-lg">
                        <img
                            alt={realTool?.name}
                            src={TOOL_URL + realTool?.imageUrl}
                            className="h-48 w-full object-cover cursor-pointer"
                            onClick={navigateToDetailPage}
                        />
                    </div>

                }
            >
                <div className="flex flex-col justify-between h-full">
                    <Meta
                        title={
                            <span
                                className="text-sm cursor-pointer text-two-lines product-name min-h-[40px]"
                                onClick={navigateToDetailPage}
                            >
                                {realTool?.name}
                            </span>
                        }
                        description={
                            <div onClick={navigateToDetailPage}>
                                <div className="text-red-500">
                                    <>
                                        {realTool?.price?.toLocaleString()}₫
                                    </>
                                </div>
                            </div>
                        }
                    />

                    {isHovered && (
                        <button
                            className="absolute bottom-0 left-0 w-full bg-[var(--primary-color)] 
                            text-white py-2 text-center transition-transform duration-100 text-xs hover:text-sm"
                            onClick={() => handleGetSimilarProduct_CBF(realTool?.toolId)}
                        >
                            Tìm sản phẩm tương tự
                        </button>

                    )}
                </div>
            </Card>
        </div>
    );
};

export default ToolItem;
