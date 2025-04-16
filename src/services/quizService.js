import { useQuery } from "@tanstack/react-query";
import httpRequest from "./httpRequest";

export const quizService = {
  getAll: async (params) => {
    try {
      const response = await httpRequest.get("/quizzes", { params });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch quizzes: " + error.message);
    }
  },

  update: async (id, payload) => {
    try {
      const response = await httpRequest.put(`/quizzes/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update quiz: " + error.message);
    }
  },

  delete: async (id) => {
    try {
      await httpRequest.delete(`/quizzes/${id}`);
    } catch (error) {
      throw new Error("Failed to delete quiz: " + error.message);
    }
  },
};

export const useQuizzes = ({ params, props }) =>
  useQuery({
    queryKey: ["GET_ALL_QUIZZES", params],
    queryFn: () => quizService.getAll(params),
    onError: (error) => {
      console.error("Error fetching quizzes:", error);
    },
    ...props,
  });
