import { useQuery } from "@tanstack/react-query";
import { readTools } from "../../../services/ToolService";

export function useTools() {
  const { isLoading, data: tools, error } = useQuery({
    queryKey: ["tools"],
    queryFn: readTools,
  });

  return { isLoading, error, tools };
}
