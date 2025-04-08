import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const professorService = {
  create: async ({
    firstName,
    lastName,
    email,
    employeeId,
    departmentId,
    organizationId,
  }) => {
    const body = {
      firstName,
      lastName,
      email,
      employeeId,
      departmentId,
      organizationId,
    };
    return await httpRequest.post("/professors", body);
  },

  getAll: async (params) => await httpRequest.get("/professors", { params }),
};

export const useProfessors = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_PROFESSORS", params],
    queryFn: () => professorService.getAll(params),
    ...props,
  });
