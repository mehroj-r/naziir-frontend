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

  getById: async (id) => {
    try {
      const response = await httpRequest.get(`/quizzes/${id}`, {
        params: { includeVersions: true },
      });
      console.log("Quiz fetched", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch quiz:", error.message);
      throw new Error("Failed to fetch quiz: " + error.message);
    }
  },

  create: async (body) => await httpRequest.post("/quizzes", body),

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

  addQuestions: async (quizId, questions) => {
    try {
      const response = await httpRequest.post(
        `/quizzes/${quizId}/questions`,
        questions
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to add questions: " + error.message);
    }
  },

  getQuestions: async (quizId) => {
    try {
      const response = await httpRequest.get(`/quizzes/${quizId}/questions`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch questions: " + error.message);
    }
  },
  updateQuestion: async (questionId, payload) => {
    try {
      const response = await httpRequest.put(
        `/questions/${questionId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update question: " + error.message);
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      await httpRequest.delete(`/questions/${questionId}`);
    } catch (error) {
      throw new Error("Failed to delete question: " + error.message);
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
