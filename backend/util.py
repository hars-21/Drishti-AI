import numpy as np
import pywt  # Discrete Wavelet Transform library
from fastapi import BackgroundTasks, FastAPI, File, UploadFile
from ultralytics import YOLO

app = FastAPI()
# Pre-load models for speed
thermal_model = YOLO("yolov8n-thermal.pt")


def consensus_engine(acoustic_data: np.ndarray, thermal_frame: np.ndarray):
    # Lock 1: Acoustic Parser (DWT)
    acoustic_score = acoustic_parser(acoustic_data)

    # Lock 2: Thermal Parser (YOLO)
    thermal_score = thermal_parser(thermal_frame)

    # Lock 3: Consensus Logic
    if acoustic_score > 0.8 and thermal_score > 0.8:
        return "EMERGENCY"  # Stop the train via Kavach
    elif acoustic_score > 0.5 or thermal_score > 0.5:
        return "ADVISORY"  # Notify Loco Pilot
    return "INFORMATIONAL"


def acoustic_parser(audio_signal: np.ndarray):
    """
    Decomposes signal into frequency bands.
    Metallic impacts appear in 'Detail' coefficients (High Frequency).
    """
    # Multi-level DWT using Daubechies (db4) wavelet
    coeffs = pywt.wavedec(audio_signal, "db4", level=4)
    cA4, cD4, cD3, cD2, cD1 = coeffs

    # Analyze the highest frequency band (cD1) for impact spikes
    energy_detail = np.sum(np.square(cD1))
    # Normalize and score based on a threshold (simplified for hackathon)
    score = min(energy_detail / 1000.0, 1.0)
    return score


def thermal_parser(image_bytes: np.ndarray):
    """
    Detects humans at specific GPS coordinates.
    """
    results = thermal_model.predict(image_bytes, conf=0.5)

    # Look for 'person' class in detection results
    for result in results:
        if any(cls == 0 for cls in result.boxes.cls):  # Class 0 is usually 'person'
            return 0.95  # High confidence human presence
    return 0.1