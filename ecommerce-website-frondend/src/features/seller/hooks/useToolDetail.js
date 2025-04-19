import { useState, useEffect } from "react";
import { callGetToolByToolId } from "../../../services/ToolService";

export const useToolDetail = (toolId) => {
    const [tool, setTool] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToolDetail = async () => {
            if (!toolId) return;

            setIsLoading(true);
            try {
                const data = await callGetToolByToolId(toolId);
                setTool(data);
            } catch (err) {
                console.error("Failed to fetch tool detail:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchToolDetail();
    }, [toolId]);

    return { tool, isLoading, error };
};