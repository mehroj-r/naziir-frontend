import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const professorsService = {
  create: async (body) => await httpRequest.post("/professors", body),
  getAll: async (params) => await httpRequest.get("/professors", {params}),
}

export const useProfessors = ({ params, props }) => 
  useQuery({
    queryKey: ["GET_ALL_PROFESSORS", params],
    queryFn: () => professorsService.getAll(params),
    ...props,
  })