import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const departmentService = {
  create: async (body) => await httpRequest.post("/departments", body),
  getAll: async (params) => await httpRequest.get("/departments", { params }),
};

export const useDepartments = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_DEPARTMENTS", params],
    queryFn: () => departmentService.getAll(params),
    ...props,
  });
