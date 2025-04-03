import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const courseService = {
  create: async (body) => await httpRequest.post("/courses", body),
  getAll: async (params) => await httpRequest.get("/courses", {params}),
}

export const useCourses = ({ params, props }) => 
  useQuery({
    queryKey: ["GET_ALL_COURSES", params],
    queryFn: () => courseService.getAll(params),
    ...props,
  })