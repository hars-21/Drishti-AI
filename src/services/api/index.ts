import axios, { AxiosError } from 'axios';
import type {
    SystemStats,
    Alert,
    Hardware,
    HardwareSearchParams,
    AnalysisResult,
    IngestParams,
    IngestResult,
    NotifyActionParams,
    ActionResult,
    ActionHistoryItem,
    ApiResponse,
} from './types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handler helper
function handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
        const message = error.response?.data?.error || error.message;
        throw new Error(`API Error: ${message}`);
    }
    throw error;
}

// ============================================
// Stats Endpoint
// ============================================

/**
 * Fetch system overview stats
 * Used in dashboard header with 30s auto-refresh
 */
export async function getStats(): Promise<SystemStats> {
    try {
        const response = await api.get<ApiResponse<SystemStats>>('/stats');
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Alerts Endpoints
// ============================================

/**
 * Fetch all alerts for the alerts feed
 * Returns timeline-sorted list with tier-based severity
 */
export async function getAlerts(): Promise<Alert[]> {
    try {
        const response = await api.get<ApiResponse<Alert[]>>('/alerts');
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Fetch single alert by ID with full details
 */
export async function getAlertById(id: string): Promise<Alert> {
    try {
        const response = await api.get<ApiResponse<Alert>>(`/alerts/${id}`);
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Hardware Endpoints
// ============================================

/**
 * Search for hardware near a location or alert
 * Used for proximity view when an alert is selected
 */
export async function searchHardware(params: HardwareSearchParams): Promise<Hardware[]> {
    try {
        const response = await api.get<ApiResponse<Hardware[]>>('/hardware/search', { params });
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Analysis Endpoints
// ============================================

/**
 * Analyze thermal image for threats
 * Supports drag-and-drop upload
 */
export async function analyzeThermal(file: File): Promise<AnalysisResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ApiResponse<AnalysisResult>>('/analyze/thermal', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Analyze audio sample for threats
 * Supports drag-and-drop upload
 */
export async function analyzeAudio(file: File): Promise<AnalysisResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ApiResponse<AnalysisResult>>('/analyze/audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Ingest Endpoint
// ============================================

/**
 * Trigger full sensor ingest and analysis pipeline
 * This is the "primary action" that shows step-by-step visual flow
 */
export async function ingestFullCheck(params: IngestParams): Promise<IngestResult> {
    try {
        const formData = new FormData();

        if (params.sensorId) formData.append('sensorId', params.sensorId);
        if (params.location) formData.append('location', params.location);
        if (params.thermalData) formData.append('thermalData', params.thermalData);
        if (params.audioData) formData.append('audioData', params.audioData);
        if (params.geometryData) formData.append('geometryData', JSON.stringify(params.geometryData));

        const response = await api.post<ApiResponse<IngestResult>>('/ingest/full-check', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Actions Endpoints
// ============================================

/**
 * Send Kavach control action
 * Requires operator confirmation before calling
 */
export async function notifyAction(params: NotifyActionParams): Promise<ActionResult> {
    try {
        const response = await api.post<ApiResponse<ActionResult>>('/actions/notify', params);
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Fetch action history for audit log
 * Returns timeline/log style data
 */
export async function getActionHistory(): Promise<ActionHistoryItem[]> {
    try {
        const response = await api.get<ApiResponse<ActionHistoryItem[]>>('/actions/history');
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================
// Legacy exports for backwards compatibility
// ============================================

/** @deprecated Use getStats() instead */
export async function getSystemOverview() {
    return getStats();
}

/** @deprecated Use getAlerts() instead */
export async function getLiveAlerts() {
    return getAlerts();
}

/** @deprecated Use getAlertById() instead */
export async function getIncidentDetails(id: string) {
    return getAlertById(id);
}

/** @deprecated Use searchHardware() instead */
export async function getSensorHealth() {
    return searchHardware({});
}

/** @deprecated Use ingestFullCheck() instead */
export async function runSimulation(params: unknown) {
    return ingestFullCheck(params as IngestParams);
}

/** @deprecated Use getAlerts() instead */
export async function getIncidents() {
    return getAlerts();
}
