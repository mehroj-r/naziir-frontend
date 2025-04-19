import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const departmentService = {
  create: async (body) => await httpRequest.post("/departments", body),
  getAll: async (params) => await httpRequest.get("/departments", { params }),
  getById: async (id) => await httpRequest.get(`/departments/${id}`),
  delete: async (id) => await httpRequest.delete("/departments/" + id),
  update: async (id, body) => await httpRequest.put(`/departments/${id}`, body),
};

export const useDepartments = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_DEPARTMENTS", params],
    queryFn: () => departmentService.getAll(params),
    ...props,
  });

export const useDepartmentById = ({ id, props }) =>
  useQuery({
    queryKey: ["GET_DEPARTMENT_BY_ID", id],
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
    ...props,
  });
