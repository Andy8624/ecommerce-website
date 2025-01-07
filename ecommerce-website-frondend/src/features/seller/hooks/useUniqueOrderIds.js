import { useEffect, useState } from "react";
import { useGetOrderToolByToolId } from "./useGetOrderToolByToolId";

export const useUniqueOrderIds = (tools) => {
    const [uniqueOrderIds, setUniqueOrderToolIds] = useState([]);

    // hàm lấy các ra sản phẩm của 1 order
    const { getOrderToolByToolId } = useGetOrderToolByToolId();

    useEffect(() => {
        const fetchOrderToolIds = async () => {
            const allOrderToolIds = new Set();

            // duyệt qua các sản phẩm của chủ shop
            for (const tool of tools) {
                // lấy ra các order-tool của sản phẩm
                const orderTools = await getOrderToolByToolId(tool.toolId);

                // lấy ra các orderId của các order-tool và lưu vào Set 
                orderTools?.forEach(orderTool => allOrderToolIds.add(orderTool?.order?.orderId));
            }

            setUniqueOrderToolIds([...allOrderToolIds]); // Chuyển Set thành mảng
        };

        // Nếu chủ shop có sản phẩm thì mới lấy ra các order
        if (tools?.length > 0) {
            fetchOrderToolIds();
        }
    }, [tools, getOrderToolByToolId]);

    return uniqueOrderIds;
};
