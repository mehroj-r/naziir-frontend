import httpRequest from "./httpRequest";

export const departmentService = {
  create: async (body) => await httpRequest.post("/departments", body),
}