import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const courseService = {
  create: async ({
    courseCode,
    courseName,
    academicTerm,
    description,
    credits,
    courseType,
    academicYear,
    organizationId,
  }) => {
    const body = {
      courseCode,
      courseName,
      academicTerm,
      description,
      credits,
      courseType,
      academicYear,
      organizationId,
    };
    return await httpRequest.post("/courses", body);
  },

  getAll: async (params) => await httpRequest.get("/courses", { params }),
};

export const useCourses = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_COURSES", params],
    queryFn: () => courseService.getAll(params),
    ...props,
  });
