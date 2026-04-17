import apiClient from "../../services/apiClient.js";

export const analyseUserApi = async (params) => {
  const response = await apiClient.post('/analyse/high-support', params);
  return response?.data;
};