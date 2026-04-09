from dataclasses import dataclass

from ..constants import (
    FALLBACK_RECOMMENDATIONS_ALERT,
    FALLBACK_RECOMMENDATIONS_SAFE,
    SRQ_QUESTIONS,
    SRQ_RECOMMENDATIONS,
)


@dataclass(frozen=True)
class RecommendationMatch:
    question_index: int
    question_text: str
    recommendation_text: str


def recommendations_from_answers(srq_answers: list[int]) -> list[RecommendationMatch]:
    if len(srq_answers) != 29:
        raise ValueError("Jumlah jawaban SRQ harus 29.")

    matches: list[RecommendationMatch] = []

    for index, answer in enumerate(srq_answers):
        if answer != 1:
            continue

        matches.append(
            RecommendationMatch(
                question_index=index + 1,
                question_text=SRQ_QUESTIONS[index],
                recommendation_text=SRQ_RECOMMENDATIONS[index],
            )
        )

    return matches


def fallback_recommendations(prediction: int) -> list[str]:
    if prediction == 1:
        return FALLBACK_RECOMMENDATIONS_ALERT
    return FALLBACK_RECOMMENDATIONS_SAFE
