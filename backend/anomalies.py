"""
Anomalies API Router - POST/GET/DELETE endpoints with file-based persistence
"""
import json
import os
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/anomalies", tags=["anomalies"])

# File-based persistence
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
ANOMALIES_FILE = os.path.join(DATA_DIR, "data_anomalies.json")
ALERTS_FILE = os.path.join(DATA_DIR, "data_alerts.json")


# --- Schemas ---
class AnomalyInputValues(BaseModel):
    size: Optional[float] = None
    weight: Optional[float] = None
    temperature: Optional[float] = None
    area: Optional[float] = None
    frequency: Optional[float] = None
    amplitude: Optional[float] = None
    audioFrequency: Optional[float] = None


class AnomalyCreate(BaseModel):
    id: str
    type: str  # OBSTRUCTION, TAMPERING, THERMAL, VIBRATION
    position: List[float]  # [lat, lng]
    intensity: float
    inputValues: AnomalyInputValues
    timestamp: Optional[str] = None


class Anomaly(BaseModel):
    id: str
    type: str
    position: List[float]
    intensity: float
    inputValues: AnomalyInputValues
    timestamp: str
    detectedBy: List[str]
    description: str
    resolved: bool


class AlertCreate(BaseModel):
    id: str
    anomalyId: str
    severity: str  # INFO, WARNING, CRITICAL
    message: str
    sensorId: str
    sensorType: str
    timestamp: str
    acknowledged: bool = False


# --- File Persistence Helpers ---
def load_anomalies() -> List[dict]:
    if not os.path.exists(ANOMALIES_FILE):
        return []
    try:
        with open(ANOMALIES_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def save_anomalies(anomalies: List[dict]) -> None:
    with open(ANOMALIES_FILE, "w") as f:
        json.dump(anomalies, f, indent=2, default=str)


def load_alerts() -> List[dict]:
    if not os.path.exists(ALERTS_FILE):
        return []
    try:
        with open(ALERTS_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def save_alerts(alerts: List[dict]) -> None:
    with open(ALERTS_FILE, "w") as f:
        json.dump(alerts, f, indent=2, default=str)


# --- Anomaly Type Definitions ---
ANOMALY_DEFS = {
    "OBSTRUCTION": {
        "description": "Rock, debris, or object blocking the track",
        "detectedBy": ["OFC_NODE"],
    },
    "TAMPERING": {
        "description": "Fishplate removal or rail displacement",
        "detectedBy": ["OFC_NODE"],
    },
    "THERMAL": {
        "description": "Fire, heat source, or human presence",
        "detectedBy": ["THERMAL_CAM"],
    },
    "VIBRATION": {
        "description": "Unusual vibration or audio anomaly detected",
        "detectedBy": ["OFC_NODE"],
    },
}


# --- Endpoints ---
@router.get("", response_model=List[dict])
def get_anomalies():
    """List all anomalies"""
    return load_anomalies()


@router.post("", response_model=dict)
def create_anomaly(data: AnomalyCreate):
    """Create a new anomaly"""
    anomalies = load_anomalies()

    # Check for duplicate
    if any(a["id"] == data.id for a in anomalies):
        raise HTTPException(status_code=400, detail="Anomaly with this ID already exists")

    # Get type definition
    type_def = ANOMALY_DEFS.get(data.type, {
        "description": "Unknown anomaly type",
        "detectedBy": ["OFC_NODE"],
    })

    anomaly = {
        "id": data.id,
        "type": data.type,
        "position": data.position,
        "intensity": data.intensity,
        "inputValues": data.inputValues.model_dump(),
        "timestamp": data.timestamp or datetime.now().isoformat(),
        "detectedBy": type_def["detectedBy"],
        "description": type_def["description"],
        "resolved": False,
    }

    anomalies.append(anomaly)
    save_anomalies(anomalies)

    return {"success": True, "id": data.id, "anomaly": anomaly}


@router.delete("/{anomaly_id}")
def delete_anomaly(anomaly_id: str):
    """Delete an anomaly by ID"""
    anomalies = load_anomalies()
    new_anomalies = [a for a in anomalies if a["id"] != anomaly_id]

    if len(new_anomalies) == len(anomalies):
        raise HTTPException(status_code=404, detail="Anomaly not found")

    save_anomalies(new_anomalies)

    # Also remove related alerts
    alerts = load_alerts()
    alerts = [a for a in alerts if a.get("anomalyId") != anomaly_id]
    save_alerts(alerts)

    return {"success": True, "id": anomaly_id}


@router.delete("")
def clear_all_anomalies():
    """Clear all anomalies and alerts"""
    save_anomalies([])
    save_alerts([])
    return {"success": True, "message": "All anomalies and alerts cleared"}


# --- Alert Endpoints ---
@router.get("/alerts", response_model=List[dict])
def get_simulation_alerts():
    """List all simulation alerts"""
    return load_alerts()


@router.post("/alerts", response_model=dict)
def create_alert(data: AlertCreate):
    """Create a new alert"""
    alerts = load_alerts()

    alert = {
        "id": data.id,
        "anomalyId": data.anomalyId,
        "severity": data.severity,
        "message": data.message,
        "sensorId": data.sensorId,
        "sensorType": data.sensorType,
        "timestamp": data.timestamp,
        "acknowledged": data.acknowledged,
    }

    alerts.insert(0, alert)  # Newest first
    save_alerts(alerts)

    return {"success": True, "id": data.id, "alert": alert}


@router.patch("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    """Acknowledge an alert"""
    alerts = load_alerts()

    for alert in alerts:
        if alert["id"] == alert_id:
            alert["acknowledged"] = True
            save_alerts(alerts)
            return {"success": True, "id": alert_id}

    raise HTTPException(status_code=404, detail="Alert not found")
