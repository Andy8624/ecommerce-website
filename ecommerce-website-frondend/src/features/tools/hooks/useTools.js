import { useQuery } from "@tanstack/react-query";
import { readTools } from "../../../services/ToolService";

export function useTools() {
  const { isLoading, data: tools, error } = useQuery({
    queryKey: ["tools"],
    queryFn: readTools,
    staleTime: 5 * 60 * 1000, // 5 phút (giữ dữ liệu "tươi", không refetch)
    cacheTime: 10 * 60 * 1000, // 10 phút (giữ cache sau khi unmount)
    refetchOnWindowFocus: false, // Không tự động fetch lại khi chuyển tab
  });

  return { isLoading, error, tools };
}
