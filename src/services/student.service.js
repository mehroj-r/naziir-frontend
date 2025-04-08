import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const studentService = {
  create: async (body) => await httpRequest.post("/students", body),
  getAll: async (params) => await httpRequest.get("/students", { params }),
};

export const useStudents = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_STUDENTS", params],
    queryFn: () => studentService.getAll(params),
    ...props,
  });
