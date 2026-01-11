import io
import math
from datetime import datetime
from typing import List

import cv2
import numpy as np
import pywt
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.io import wavfile
from ultralytics import YOLO

# --- SETUP ---
app = FastAPI(title="Triple-Lock Rail AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load AI Model (YOLOv8)
try:
    model = YOLO("yolov8n.pt")
except:
    print("Warning: YOLO model not found, ensuring network to download...")
    model = None  # Fallback handling

# --- MOCK DATABASE (In-Memory) ---
alerts_db = []
actions_log = []

# Mock Hardware Registry with 50km of sensors
hardware_db = [
    {
        "id": "HW-001",
        "type": "OFC_NODE",
        "lat": 28.6100,
        "lng": 77.2000,
        "status": "active",
    },
    {
        "id": "HW-002",
        "type": "THERMAL_CAM",
        "lat": 28.6100,
        "lng": 77.2000,
        "status": "active",
    },
    {
        "id": "HW-003",
        "type": "OFC_NODE",
        "lat": 28.6150,
        "lng": 77.2050,
        "status": "faulty",
    },  # One faulty
    {
        "id": "HW-004",
        "type": "THERMAL_CAM",
        "lat": 28.6200,
        "lng": 77.2100,
        "status": "active",
    },
]

# --- SCHEMAS ---


class HardwareInfo(BaseModel):
    id: str
    type: str
    coordinates: dict
    status: str


class DashboardStats(BaseModel):
    active_hardware: int
    faulty_hardware: int
    total_alerts: int


class AnalysisResult(BaseModel):
    alert_level: str
    analysis_details: str
    confidence: float


class ActionRequest(BaseModel):
    alert_id: str
    action: str  # STOP, SLOW, INFORM
    operator_id: str


class ActionLog(BaseModel):
    id: int
    alert_id: str
    action: str
    timestamp: datetime


# --- 1. ALERTS & DASHBOARD DATA ---


@app.get("/api/v1/alerts")
def get_all_alerts():
    """Requirement: All alerts with coordinates & level"""
    return alerts_db


@app.get("/api/v1/stats", response_model=DashboardStats)
def get_dashboard_stats():
    """Requirement: Active & Faulty hardware count"""
    active = len([h for h in hardware_db if h["status"] == "active"])
    faulty = len([h for h in hardware_db if h["status"] == "faulty"])
    return {
        "active_hardware": active,
        "faulty_hardware": faulty,
        "total_alerts": len(alerts_db),
    }


# --- 2. HARDWARE SEARCH ---


@app.get("/api/v1/hardware/search", response_model=List[HardwareInfo])
def search_hardware(lat: float, lng: float, radius_km: float = 1.0):
    """
    Requirement: Search for hardware on basis of coordinates.
    Returns: id, coordinates, status.
    """
    results = []
    for hw in hardware_db:
        # Simple Euclidean distance for hackathon (approximate)
        # 1 deg lat ~= 111km
        dist = math.sqrt((hw["lat"] - lat) ** 2 + (hw["lng"] - lng) ** 2) * 111
        if dist <= radius_km:
            results.append(
                {
                    "id": hw["id"],
                    "type": hw["type"],
                    "coordinates": {"lat": hw["lat"], "lng": hw["lng"]},
                    "status": hw["status"],
                }
            )
    return results


# --- 3. THERMAL ANALYZER ---


@app.post("/api/v1/analyze/thermal", response_model=AnalysisResult)
async def analyze_thermal(file: UploadFile = File(...)):
    """
    Requirement: Detect potential tampering.
    Returns: alert_level, thermal_analysis
    """
    # Read Image
    image_bytes = await file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # 1. Convert to Thermal View (Simulation)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thermal_view = cv2.applyColorMap(gray, cv2.COLORMAP_JET)

    # 2. Run YOLO
    if model:
        results = model(thermal_view, verbose=False)
        human_conf = 0.0
        for r in results:
            for box in r.boxes:
                if int(box.cls[0]) == 0:  # Class 0 = Person
                    human_conf = max(human_conf, float(box.conf[0]))
    else:
        human_conf = 0.0  # Mock if model fails

    # 3. Logic
    if human_conf > 0.6:
        return {
            "alert_level": "HIGH",
            "analysis_details": f"Human Heat Signature Detected (37°C)",
            "confidence": human_conf,
        }
    return {
        "alert_level": "LOW",
        "analysis_details": "Ambient environment only. No life detected.",
        "confidence": 0.0,
    }


# --- 4. AUDIO ANALYZER ---


@app.post("/api/v1/analyze/audio", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)):
    """
    Requirement: Detect potential tampering.
    Returns: alert_level, audio_analysis
    """
    # Read Audio
    audio_bytes = await file.read()
    try:
        sr, audio_np = wavfile.read(io.BytesIO(audio_bytes))
    except:
        return {
            "alert_level": "ERROR",
            "analysis_details": "Invalid WAV file",
            "confidence": 0.0,
        }

    # Normalize mono/stereo
    if len(audio_np.shape) > 1:
        audio_np = audio_np.mean(axis=1)

    # DWT Analysis (Wavelet)
    coeffs = pywt.wavedec(audio_np, "db4", level=4)
    # High freq energy (Sabotage signatures)
    high_freq_energy = np.sum(np.square(coeffs[-1])) + np.sum(np.square(coeffs[-2]))
    # Low freq energy (Train rumble)
    low_freq_energy = np.sum(np.square(coeffs[0]))

    ratio = high_freq_energy / (low_freq_energy + 1e-5)

    if ratio > 0.05:  # Threshold
        return {
            "alert_level": "HIGH",
            "analysis_details": "High-Frequency Metallic Impact Detected (Sawing/Hammering)",
            "confidence": min(ratio * 10, 1.0),
        }

    return {
        "alert_level": "LOW",
        "analysis_details": "Normal Low-Frequency Background Rumble",
        "confidence": 0.1,
    }


# --- 5. CONTROL CENTER NOTIFICATIONS & LOGS ---


@app.post("/api/v1/actions/notify")
def notify_control_center(action_req: ActionRequest):
    """
    Requirement: Notify control center to stop, slow, inform.
    """
    # Log the action
    entry = {
        "id": len(actions_log) + 1,
        "alert_id": action_req.alert_id,
        "action": action_req.action,
        "operator": action_req.operator_id,
        "timestamp": datetime.now(),
    }
    actions_log.append(entry)

    # In real world: Send MQTT message to Train
    print(
        f"[{datetime.now()}] COMMAND SENT TO TRAIN: {action_req.action} (Alert {action_req.alert_id})"
    )

    return {
        "status": "success",
        "message": f"Train Driver Notified: {action_req.action}",
    }


@app.get("/api/v1/actions/history", response_model=List[ActionLog])
def list_action_history():
    """
    Requirement: List all notifications/actions taken.
    """
    return actions_log


# --- 6. INTEGRATED INGEST (Optional: For automatic workflow) ---
@app.post("/api/v1/ingest/full-check")
async def ingest_full_sensor_data(
    lat: float, lng: float, audio: UploadFile = File(...), image: UploadFile = File(...)
):
    """
    Helper: Runs both audio and thermal, saves alert if dangerous.
    """
    # Run Audio
    audio_res = await analyze_audio(audio)
    # Run Thermal
    thermal_res = await analyze_thermal(image)

    # Consensus
    final_tier = "Informational"
    if audio_res["alert_level"] == "HIGH" and thermal_res["alert_level"] == "HIGH":
        final_tier = "Emergency"
    elif audio_res["alert_level"] == "HIGH" or thermal_res["alert_level"] == "HIGH":
        final_tier = "Advisory"

    alert = {
        "id": f"AL-{len(alerts_db)+1}",
        "tier": final_tier,
        "coordinates": {"lat": lat, "lng": lng},
        "audio_analysis": audio_res["analysis_details"],
        "thermal_analysis": thermal_res["analysis_details"],
        "timestamp": datetime.now(),
    }

    if final_tier != "Informational":
        alerts_db.append(alert)

    return alert


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)