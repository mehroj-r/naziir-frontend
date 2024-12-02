import httpRequest from "./httpRequest";

export const organizationService = {
	getAllAvailableOrganizations: async () => await httpRequest.get("/organizations/available"),

}