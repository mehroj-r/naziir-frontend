import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const groupService = {
  create: async (body) => await httpRequest.post("/groups", body),
  getAll: async (params) => await httpRequest.get("/groups", { params }),
  delete: async (id) => await httpRequest.delete("/groups/" + id),
  getById: async (id) => await httpRequest.get(`/groups/${id}`),
  update: async (id, body) => await httpRequest.put(`/groups/${id}`, body), // ✅ add this
};

export const useGroups = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_GROUPS", params],
    queryFn: () => groupService.getAll(params),
    ...props,
  });


