import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const courseService = {
  create: async (body) => await httpRequest.post("/courses", body),

  getAll: async (params) => await httpRequest.get("/courses", { params }),

  assignProfessor: async (courseId, body) =>
    await httpRequest.patch(`/courses/${courseId}/professors`, body),
  update: async (id, body) => await httpRequest.patch(`/courses/${id}`, body),
  delete: async (id) => await httpRequest.delete(`/courses/${id}`),
};

export const useCourses = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_COURSES", params],
    queryFn: () => courseService.getAll(params),
    ...props,
  });
