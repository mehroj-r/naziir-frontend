import httpRequest from "./httpRequest";

export const userService = {
	login: async (body) => await httpRequest.post("/login", body),
	getById: async (id) => await httpRequest.get(`/users/${id}`)
}