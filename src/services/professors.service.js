import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const professorService = {
  create: async (body) => await httpRequest.post("/professors", body),
  getAll: async (params) => await httpRequest.get("/professors", { params }),
  update: async (id, body) => await httpRequest.put(`/professors/${id}`, body),
  delete: async (id) => await httpRequest.delete(`/professors/${id}`),
  getById: async (id) => await httpRequest.get(`/professors/${id}`),
};

export const useProfessors = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_PROFESSORS", params],
    queryFn: () => professorService.getAll(params),
    ...props,
  });
