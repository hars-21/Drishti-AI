/**
 * API Types for Triple-Lock Rail AI System
 * Base URL: http://localhost:8000/api/v1
 */

// ============================================
// Stats Endpoint Types
// ============================================
export interface SystemStats {
    activeHardware: number;
    faultyHardware: number;
    totalAlerts: number;
    lastUpdated?: string;
}

// ============================================
// Alerts Endpoint Types
// ============================================
export type AlertTier = 'emergency' | 'advisory' | 'info';
export type AlertStatus = 'active' | 'investigating' | 'resolved' | 'false_positive';

export interface AlertCoordinates {
    lat: number;
    lng: number;
}

export interface AlertAnalysis {
    thermal?: {
        confidence: number;
        classification: string;
        imageUrl?: string;
    };
    audio?: {
        confidence: number;
        classification: string;
        waveformUrl?: string;
    };
    geometry?: {
        confidence: number;
        deviation: number;
    };
}

export interface Alert {
    id: string;
    tier: AlertTier;
    title: string;
    description: string;
    location: string;
    coordinates: AlertCoordinates;
    timestamp: string;
    status: AlertStatus;
    analysis?: AlertAnalysis;
    consensusScore?: number;
}

// ============================================
// Hardware Endpoint Types
// ============================================
export type HardwareType = 'ofc_node' | 'camera' | 'lidar' | 'thermal';
export type HardwareStatus = 'active' | 'faulty' | 'offline' | 'maintenance';

export interface Hardware {
    id: string;
    type: HardwareType;
    name: string;
    status: HardwareStatus;
    location: string;
    coordinates: AlertCoordinates;
    lastPing?: string;
}

export interface HardwareSearchParams {
    alertId?: string;
    lat?: number;
    lng?: number;
    radius?: number; // in meters
}

// ============================================
// Analysis Endpoint Types
// ============================================
export interface AnalysisResult {
    alertLevel: AlertTier;
    confidence: number;
    explanation: string;
    detectedObjects?: string[];
    processingTime?: number;
}

// ============================================
// Ingest Endpoint Types
// ============================================
export type IngestStep = 'ingesting' | 'analyzing' | 'consensus' | 'complete' | 'error';

export interface IngestParams {
    sensorId?: string;
    location?: string;
    thermalData?: File;
    audioData?: File;
    geometryData?: object;
}

export interface IngestResult {
    success: boolean;
    step: IngestStep;
    alertId?: string;
    alert?: Alert;
    error?: string;
}

// ============================================
// Actions Endpoint Types
// ============================================
export type ActionType = 'stop' | 'slow' | 'inform';

export interface NotifyActionParams {
    type: ActionType;
    alertId: string;
    operatorId?: string;
    message?: string;
}

export interface ActionResult {
    success: boolean;
    actionId: string;
    timestamp: string;
    acknowledgedBy?: string;
    error?: string;
}

export interface ActionHistoryItem {
    id: string;
    type: ActionType;
    alertId: string;
    timestamp: string;
    operatorId: string;
    operatorName?: string;
    status: 'sent' | 'acknowledged' | 'failed';
    message?: string;
}

// ============================================
// API Response Wrapper Types
// ============================================
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
