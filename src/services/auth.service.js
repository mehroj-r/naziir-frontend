import httpRequest from "./httpRequest";
import httpRequestAuth from "./httpRequestAuth";

export const authService = {
	login: async (body) => await httpRequestAuth.post("/login", body),
	register: async (body) => await httpRequestAuth.post("/register", body),
	google: async (body) => await httpRequestAuth.post("/google", body),
	forgotPassword: async (email) => await httpRequestAuth.get(`/forgot-password?email=${email}`),
	validateCode: async (body) => await httpRequestAuth.post('/validate-reset-code', body),
	resetCode: async (body) => await httpRequestAuth.post("/reset-password", body),
	logout: async () => await httpRequest.post("/auth/logout"),
}