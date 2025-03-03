import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const groupsService = {
  create: async (body) => await httpRequest.post("/groups", body),
  getAll: async (params) => await httpRequest.get("/groups", {params}),
}

export const useGroups = ({ params, props }) => 
  useQuery({
    queryKey: ["GET_ALL_GROUPS", params],
    queryFn: () => groupsService.getAll(params),
    ...props,
  })