import httpRequestAuth from "./httpRequestAuth";

export const authService = {
	login: async (body) => await httpRequestAuth.post("api/auth/login", body),
	register: async (body) => await httpRequestAuth.post("api/auth/register", body), 
}