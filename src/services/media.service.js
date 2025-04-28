import httpRequest from "./httpRequest";

export const mediaService = {
  // create: async (body) => await httpRequest.post("/groups", body),
  // getAll: async (params) => await httpRequest.get("/groups", { params }),
  // delete: async (id) => await httpRequest.delete("/groups/" + id),
  getById: async (id) => await httpRequest.get(`/media/${id}`, { responseType: "blob" }),
  // update: async (id, body) => await httpRequest.put(`/groups/${id}`, body),
};
