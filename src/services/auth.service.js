import httpRequestAuth from "./httpRequestAuth";

export const authService = {
	login: async (body) => await httpRequestAuth.post("api/auth/login", body),
	register: async (body) => await httpRequestAuth.post("api/auth/register", body),
	google: async (body) => await httpRequestAuth.post("api/auth/google", body),
	forgotPassword: async (param) => await httpRequestAuth.get(`api/auth/forgot-password?email=${param}`),
	validateCode: async (body) => await httpRequestAuth.post('api/auth/validate-reset-code', body),
	resetCode: async (body) => await httpRequestAuth.post("api/auth/reset-password", body),
}