import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const studentService = {
  create: async (body) => await httpRequest.post("/students", body),
  getAll: async (params) => await httpRequest.get("/students", { params }),
  update: async (id, body) => await httpRequest.put(`/students/${id}`, body),
  delete: async (id) => await httpRequest.delete(`/students/${id}`),
};

export const useStudents= ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_STUDENTS", params],
    queryFn: () => studentService.getAll(params),
    ...props,
  });
