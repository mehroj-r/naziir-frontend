import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const groupService = {
  create: async ({ name, description, departmentId }) => {
    const body = { name, description, departmentId };
    return await httpRequest.post("/groups", body);
  },
  getAll: async (params) => await httpRequest.get("/groups", { params }),
};

export const useGroups = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_GROUPS", params],
    queryFn: () => groupService.getAll(params),
    ...props,
  });
