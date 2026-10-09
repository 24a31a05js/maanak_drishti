/**
 * API Service Client for Maanak Drishti
 * Configured for direct integration with FastAPI backend (e.g. http://localhost:8000/api/v1)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  /**
   * Health check endpoint
   */
  checkHealth: async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return await response.json();
    } catch {
      return { status: 'offline', message: 'Backend not connected' };
    }
  },

  /**
   * Label analysis endpoint (to be connected in backend phase)
   */
  analyzeLabel: async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch {
      throw new Error('Analysis engine backend is not available yet.');
    }
  },
};
