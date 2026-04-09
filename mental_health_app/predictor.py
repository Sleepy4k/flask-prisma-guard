from dataclasses import dataclass
from pathlib import Path

import joblib
import pandas as pd


@dataclass(frozen=True)
class PredictorOutput:
    prediction: int
    probability: float


class PredictorService:
    def __init__(self, models_dir: Path) -> None:
        self._models_dir = models_dir
        self._scaler = None
        self._pca = None
        self._model = None
        self._load_error = ""
        self._models_loaded = False
        self._load_models()

    def _load_models(self) -> None:
        try:
            self._scaler = joblib.load(self._models_dir / "scaler.pkl")
            self._pca = joblib.load(self._models_dir / "pca.pkl")
            self._model = joblib.load(self._models_dir / "model_logistic_regression.pkl")
            self._models_loaded = True
            self._load_error = ""
        except Exception as exc:
            self._models_loaded = False
            self._load_error = str(exc)
            print(f"Warning: Models failed to load. Error: {exc}")

    @property
    def is_ready(self) -> bool:
        return self._models_loaded

    @property
    def load_error(self) -> str:
        return self._load_error

    def predict(
        self,
        gender: int,
        usia: int,
        semester: int,
        ipk: float,
        srq_answers: list[int],
    ) -> PredictorOutput:
        if not self._models_loaded:
            raise RuntimeError("Model belum siap digunakan.")

        if len(srq_answers) != 29:
            raise ValueError("Jumlah jawaban SRQ harus 29.")

        input_data = [gender, usia, semester, ipk] + srq_answers
        feature_names = ["Gender", "Usia", "Semester", "IPK"] + [f"SRQ{i}" for i in range(1, 30)]
        df_input = pd.DataFrame([input_data], columns=feature_names)

        input_scaled = self._scaler.transform(df_input)
        input_pca = self._pca.transform(input_scaled)

        prediction = int(self._model.predict(input_pca)[0])
        probability = round(float(self._model.predict_proba(input_pca)[0][1]) * 100, 2)

        return PredictorOutput(prediction=prediction, probability=probability)
