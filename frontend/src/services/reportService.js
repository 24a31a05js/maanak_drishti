/**
 * Report Service for Maanak Drishti
 * Manages persistent storage and lifecycle for Citizen Consumer Reports
 * Primary persistence is maintained through the FastAPI / MySQL 8 backend database,
 * with local offline caching for high availability.
 */

import { api } from './api';

const STORAGE_KEY_REPORTS = 'maanak_drishti_consumer_reports';

/**
 * Generate client-side fallback ID if offline
 */
function generateFallbackReportId() {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MD-REP-${year}-${randomPart}${randomSuffix}`;
}

export const reportService = {
  /**
   * Retrieve all reports from backend database (with local cache fallback)
   * @param {{ role?: string } | null} currentUser
   */
  getReportsAsync: async (currentUser = null) => {
    const role = currentUser?.role || 'consumer';
    try {
      const reports = await api.getReports({ role });
      // Update local cache
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
      }
      return reports;
    } catch {
      // Offline fallback from local cache
      return reportService.getReports(currentUser);
    }
  },

  /**
   * Synchronous getter from local persistent cache
   */
  getReports: (currentUser = null) => {
    if (typeof window === 'undefined') return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEY_REPORTS);
      const reports = data ? JSON.parse(data) : [];
      reports.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      return reports;
    } catch {
      return [];
    }
  },

  /**
   * Retrieve a single report by ID
   */
  getReportById: async (reportId, currentUser = null) => {
    const role = currentUser?.role || 'consumer';
    try {
      return await api.getReportById(reportId, role);
    } catch {
      const all = reportService.getReports(currentUser);
      return all.find((r) => r.id === reportId) || null;
    }
  },

  /**
   * Submit a new consumer report and persist it directly in backend database
   */
  createReport: async (payload) => {
    if (!payload.productName || !payload.productName.trim()) {
      throw new Error('Product name is required for submission.');
    }
    if (!payload.reason || !payload.reason.trim()) {
      throw new Error('Please select a valid reason for reporting.');
    }
    if (!payload.description || !payload.description.trim()) {
      throw new Error('Please describe the suspected packaging or declaration issue.');
    }

    try {
      // 1. Primary: Save directly in backend database via REST API
      const created = await api.createReport(payload);

      // 2. Cache in local storage for instant optimistic updates
      if (typeof window !== 'undefined') {
        const cached = reportService.getReports();
        cached.unshift(created);
        window.localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(cached));
        window.dispatchEvent(new CustomEvent('maanak_reports_updated', { detail: { reportId: created.id } }));
      }

      return created;
    } catch (err) {
      // If backend network fails, save to local storage with fallback ID and inform user
      console.warn('Backend database unreachable during report submission, caching locally:', err.message);

      const fallbackId = generateFallbackReportId();
      const now = new Date().toISOString();
      const localReport = {
        id: fallbackId,
        productName: payload.productName.trim(),
        manufacturer: payload.manufacturer || 'Not declared',
        mrp: payload.mrp || 'Not declared',
        netQuantity: payload.netQuantity || 'Not declared',
        mfgDate: payload.mfgDate || 'Not declared',
        consumerCare: payload.consumerCare || 'Not declared',
        reason: payload.reason.trim(),
        reasonCategory: payload.reasonCategory || 'packaging_declaration',
        description: payload.description.trim(),
        imageUrl: payload.imageUrl || null,
        extractedDetails: payload.extractedDetails || null,
        complianceFindings: payload.complianceFindings || null,
        consumerName: payload.consumerName || 'Anonymous Consumer',
        consumerEmail: payload.consumerEmail || '',
        consumerPhone: payload.consumerPhone || '',
        status: 'Pending Review',
        priority: 'Medium',
        submittedAt: now,
        updatedAt: now,
        investigationNotes: '',
        rejectionReason: '',
        inspectorAuditTrail: [
          {
            action: 'REPORT_SUBMITTED_LOCAL_CACHE',
            timestamp: now,
            inspectorId: 'SYSTEM',
            notes: 'Saved to local cache while backend service reconnects.',
          },
        ],
      };

      if (typeof window !== 'undefined') {
        const cached = reportService.getReports();
        cached.unshift(localReport);
        window.localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(cached));
        window.dispatchEvent(new CustomEvent('maanak_reports_updated', { detail: { reportId: fallbackId } }));
      }

      return localReport;
    }
  },

  /**
   * Update report status and append inspector audit trail in backend database
   */
  updateReportStatus: async (reportId, updateData) => {
    if (!reportId) throw new Error('Report ID is required.');

    try {
      // 1. Primary: Update in backend database
      const updated = await api.updateReportStatus(reportId, updateData);

      // 2. Sync local cache
      if (typeof window !== 'undefined') {
        const cached = reportService.getReports();
        const idx = cached.findIndex((r) => r.id === reportId);
        if (idx !== -1) {
          cached[idx] = updated;
          window.localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(cached));
        }
        window.dispatchEvent(new CustomEvent('maanak_reports_updated', { detail: { reportId } }));
      }

      return updated;
    } catch {
      // Fallback local update
      const cached = reportService.getReports();
      const idx = cached.findIndex((r) => r.id === reportId);
      if (idx === -1) throw new Error(`Report ${reportId} not found`);

      const current = cached[idx];
      const now = new Date().toISOString();
      const updated = {
        ...current,
        status: updateData.status || current.status,
        investigationNotes: updateData.investigationNotes || current.investigationNotes,
        rejectionReason: updateData.rejectionReason || current.rejectionReason,
        updatedAt: now,
      };

      cached[idx] = updated;
      window.localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(cached));
      window.dispatchEvent(new CustomEvent('maanak_reports_updated', { detail: { reportId } }));
      return updated;
    }
  },

  /**
   * Get aggregate report metrics synchronously from local cache
   */
  getReportStatsSync: () => {
    const cached = reportService.getReports();
    return {
      total: cached.length,
      pending: cached.filter((r) => r.status === 'Pending Review').length,
      underInvestigation: cached.filter((r) => r.status === 'Under Investigation').length,
      resolved: cached.filter((r) => r.status === 'Resolved').length,
      rejected: cached.filter((r) => r.status === 'Rejected').length,
    };
  },

  /**
   * Get aggregate report metrics from backend database (with local fallback)
   */
  getReportStats: async () => {
    try {
      return await api.getReportStats();
    } catch {
      return reportService.getReportStatsSync();
    }
  },
};
