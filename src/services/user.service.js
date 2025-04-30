import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const userService = {
	login: async (body) => await httpRequest.post("/login", body),
	getById: async (id) => await httpRequest.get(`/users/${id}`)
}

export const useUserById = ({ id, props }) =>
  useQuery({
    queryKey: ["GET_USER_BY_ID", id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
    ...props,
  });