import httpRequest from "./httpRequest";

export const departmentService = {
	// login: async (body) => await httpRequest.post("/login", body),
	// forgotPassword: async (param) => await httpRequestAuth.get(`/forgot-password?email=${param}`),
  create: async (body) => await httpRequest.post("/departments", body),
}