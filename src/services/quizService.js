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
  generateVersions: async (id) => await httpRequest.post(`quizzes/${id}/generate-versions`),
  getVersions: async (id) => await httpRequest.get(`quizzes/${id}/versions`),
  distributeVersions: async (id) => await httpRequest.post(`quizzes/${id}/distribute`),

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

  updateQuestion: async (qestionId, payload) => {
    try {
      const response = await httpRequest.put(
        `/questions/${qestionId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update question: " + error.message);
    }
  },

  deleteQuestion: async (qestionId) => {
    try {
      await httpRequest.delete(`/questions/${qestionId}`);
    } catch (error) {
      throw new Error("Failed to delete question: " + error.message);
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

  startAttempt: async (quizId) => {
    const response = await httpRequest.post(
      `/student/quizzes/attempts/start/${quizId}`
    );
    return response.data;
  },

  submitResponses: async (quizId, responses) => {
    const response = await httpRequest.post(
      `/student/quizzes/attempts/${quizId}/responses`,
      responses
    );
    return response.data;
  },

  finishAttempt: async (quizId) => {
    try {
      const response = await httpRequest.post(
        `/student/quizzes/attempts/${quizId}/finish`
      );
      return response.data;
    } catch (error) {
      console.error("Error finishing the quiz attempt", error);
      throw error;
    }
  },

  getResult: async (quizId) => {
    try {
      const response = await httpRequest.get(
        `/student/quizzes/attempts/${quizId}/result`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz result:", error);
      throw error;
    }
  },

  gradeQuestion: async (data) => {
    console.log("Grade function called with data:", data); // Log here as well

    try {
      console.log("Grading data:", data); // This should print the data

      const response = await httpRequest.post(
        "/professor/grading/question/override",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Grading failed:", error.response?.data || error.message);
      throw new Error("Grading failed: " + error.message);
    }
  },

  getQuizGradingReport: async (quizId) => {
    try {
      const response = await httpRequest.get(
        `/professor/grading/quiz/${quizId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching grading report:", error.message);
      throw new Error("Failed to fetch grading report: " + error.message);
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
