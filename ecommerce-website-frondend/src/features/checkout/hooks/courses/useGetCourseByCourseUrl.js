// import { useQuery } from "@tanstack/react-query";
// import { callGetCourseDBByCourseUrl } from "../../../services/CourseService";

// export function useGetCourseDBByCourseUrl(courseUrl) {
//     const { data: courseDB, isPending: isLoadingCourseDB, error } = useQuery({
//         queryKey: ["courses", courseUrl],
//         queryFn: () => {
//             return callGetCourseDBByCourseUrl(courseUrl);
//         },
//         enabled: !!courseUrl,
//     });

//     return { courseDB, isLoadingCourseDB, error };
// }