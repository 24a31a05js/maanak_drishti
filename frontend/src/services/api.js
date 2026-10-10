/**
 * API Service Client for Maanak Drishti
 * Configured for direct integration with FastAPI backend through local reverse proxy (/api/v1)
 * or explicit backend URL (e.g. http://127.0.0.1:8000/api/v1).
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = {
  /**
   * Health check endpoint
   */
  checkHealth: async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch {
      return { status: 'offline', message: 'Backend not connected' };
    }
  },

  /**
   * Label optical text extraction endpoint
   */
  analyzeLabel: async (payload) => {
    try {
      let options = {};
      if (payload instanceof FormData) {
        options = {
          method: 'POST',
          body: payload,
        };
      } else {
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        };
      }

      const response = await fetch(`${BASE_URL}/ocr/analyze`, options);
      if (!response.ok) throw new Error('OCR extraction failed');
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Analysis engine backend is not available yet.');
    }
  },

  /**
   * Evaluate compliance against Legal Metrology Rules, 2011 Rule 6
   */
  evaluateCompliance: async (labelData) => {
    try {
      const response = await fetch(`${BASE_URL}/compliance/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labelData),
      });
      if (!response.ok) throw new Error('Compliance evaluation failed');
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Compliance engine backend error');
    }
  },

  /**
   * Submit citizen grievance report to database
   */
  createReport: async (reportPayload) => {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit report to database');
    }
    return await response.json();
  },

  /**
   * Get reports list with role-based access
   */
  getReports: async ({ status, priority, search, role = 'consumer' } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (priority && priority !== 'ALL') params.append('priority', priority);
    if (search) params.append('search', search);
    params.append('role', role);

    const headers = { 'X-User-Role': role };
    const response = await fetch(`${BASE_URL}/reports?${params.toString()}`, { headers });
    if (!response.ok) {
      throw new Error('Failed to retrieve reports from database');
    }
    return await response.json();
  },

  /**
   * Get single report details by ID
   */
  getReportById: async (reportId, role = 'consumer') => {
    const headers = { 'X-User-Role': role };
    const response = await fetch(`${BASE_URL}/reports/${reportId}?role=${role}`, { headers });
    if (!response.ok) {
      throw new Error(`Report with ID ${reportId} not found`);
    }
    return await response.json();
  },

  /**
   * Get aggregate report metrics for inspector dashboard
   */
  getReportStats: async () => {
    const response = await fetch(`${BASE_URL}/reports/stats`);
    if (!response.ok) {
      throw new Error('Failed to retrieve report statistics');
    }
    return await response.json();
  },

  /**
   * Update report status and add investigation notes (Inspector only)
   */
  updateReportStatus: async (reportId, updatePayload) => {
    const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'inspector',
      },
      body: JSON.stringify(updatePayload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update report status in database');
    }
    return await response.json();
  },
};
