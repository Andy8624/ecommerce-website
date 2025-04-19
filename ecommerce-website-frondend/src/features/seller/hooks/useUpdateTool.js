import { useState } from "react";
import { callUpdateTool } from "../../../services/ToolService";

export const useUpdateTool = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateTool = async (toolId, updatedTool) => {
        setIsUpdating(true);
        try {
            const response = await callUpdateTool(toolId, updatedTool);
            return response;
        } catch (error) {
            console.error("Error updating tool:", error);
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateTool, isUpdating };
};
