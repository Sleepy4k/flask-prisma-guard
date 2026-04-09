from pathlib import Path

from flask import Blueprint, jsonify, render_template, request

from .constants import SRQ_QUESTIONS
from .utils.parsers import parse_float_field, parse_gender_text, parse_int_field, parse_srq_answers
from .handlers.predictor import PredictorService
from .handlers.recommendations import fallback_recommendations, recommendations_from_answers

main_bp = Blueprint("main", __name__)

BASE_DIR = Path(__file__).resolve().parent.parent
predictor_service = PredictorService(BASE_DIR / "models")


def _build_student_data() -> dict[str, str]:
    return {
        "nama": request.form.get("nama", "-").strip() or "-",
        "perguruan_tinggi": request.form.get("perguruan_tinggi", "-").strip() or "-",
        "program_studi": request.form.get("program_studi", "-").strip() or "-",
        "gender_text": parse_gender_text(request.form.get("gender")),
        "usia": request.form.get("usia", "-"),
        "semester": request.form.get("semester", "-"),
        "ipk": request.form.get("ipk", "-"),
    }


def _status_from_prediction(prediction: int) -> str:
    return "Perlu Perhatian" if prediction == 1 else "Aman"


@main_bp.get("/")
def index():
    return render_template("index.html")


@main_bp.get("/about")
def about():
    return render_template("about.html")


@main_bp.get("/health")
def health():
    if predictor_service.is_ready:
        return jsonify({"status": "ok", "models_loaded": True}), 200

    return (
        jsonify(
            {
                "status": "degraded",
                "models_loaded": False,
                "detail": predictor_service.load_error or "Model belum siap.",
            }
        ),
        503,
    )


@main_bp.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        return render_template("predict.html", questions=SRQ_QUESTIONS)

    student_data = _build_student_data()

    if not predictor_service.is_ready:
        return (
            render_template(
                "result.html",
                status="Sistem Sedang Perbaikan",
                probability=None,
                recommendations=["Model prediksi tidak ditemukan. Silakan coba lagi nanti."],
                matched_recommendations=[],
                student_data=student_data,
                is_error=True,
            ),
            503,
        )

    try:
        gender = parse_int_field(request.form, "gender", "Jenis Kelamin", 0, 1)
        usia = parse_int_field(request.form, "usia", "Usia", 15, 60)
        semester = parse_int_field(request.form, "semester", "Semester", 1, 14)
        ipk = parse_float_field(request.form, "ipk", "IPK", 0.0, 4.0)
        srq_answers = parse_srq_answers(request.form, total_questions=29)

        prediction_result = predictor_service.predict(gender, usia, semester, ipk, srq_answers)
        status = _status_from_prediction(prediction_result.prediction)

        matched_recommendations = recommendations_from_answers(srq_answers)
        recommendations = []
        if not matched_recommendations:
            recommendations = fallback_recommendations(prediction_result.prediction)

        return render_template(
            "result.html",
            status=status,
            probability=prediction_result.probability,
            recommendations=recommendations,
            matched_recommendations=matched_recommendations,
            student_data=student_data,
            is_error=False,
        )

    except Exception as exc:
        return (
            render_template(
                "result.html",
                status="Input Tidak Valid",
                probability=None,
                recommendations=[
                    f"Terjadi kesalahan saat memproses data: {exc}",
                    "Periksa kembali form dan pastikan semua jawaban telah diisi dengan benar.",
                ],
                matched_recommendations=[],
                student_data=student_data,
                is_error=True,
            ),
            400,
        )
