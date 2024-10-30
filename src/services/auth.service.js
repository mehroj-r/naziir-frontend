import httpRequest from "./httpRequest";

export const authService = {
	login: async (body) => await httpRequest.post("api/auth/login", body),
	register: async (body) => await httpRequest.post("api/auth/login", body), 
}