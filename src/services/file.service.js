import httpRequest from "./httpRequest";

export const fileService = {
	upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file)

    return await httpRequest.post('/media/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
  },
};