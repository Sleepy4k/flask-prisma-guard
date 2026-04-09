from collections.abc import Mapping


def parse_int_field(
    form: Mapping[str, str],
    field_name: str,
    label: str,
    min_value: int | None = None,
    max_value: int | None = None,
) -> int:
    value_raw = str(form.get(field_name, "")).strip()
    if value_raw == "":
        raise ValueError(f"{label} wajib diisi.")

    try:
        value = int(value_raw)
    except ValueError as err:
        raise ValueError(f"{label} harus berupa angka bulat.") from err

    if min_value is not None and value < min_value:
        raise ValueError(f"{label} minimal {min_value}.")
    if max_value is not None and value > max_value:
        raise ValueError(f"{label} maksimal {max_value}.")

    return value


def parse_float_field(
    form: Mapping[str, str],
    field_name: str,
    label: str,
    min_value: float | None = None,
    max_value: float | None = None,
) -> float:
    value_raw = str(form.get(field_name, "")).strip()
    if value_raw == "":
        raise ValueError(f"{label} wajib diisi.")

    try:
        value = float(value_raw)
    except ValueError as err:
        raise ValueError(f"{label} harus berupa angka desimal.") from err

    if min_value is not None and value < min_value:
        raise ValueError(f"{label} minimal {min_value}.")
    if max_value is not None and value > max_value:
        raise ValueError(f"{label} maksimal {max_value}.")

    return value


def parse_srq_answers(form: Mapping[str, str], total_questions: int = 29) -> list[int]:
    answers: list[int] = []

    for index in range(1, total_questions + 1):
        value = str(form.get(f"srq_{index}", "")).strip()
        if value not in {"0", "1"}:
            raise ValueError(f"Jawaban SRQ nomor {index} belum diisi.")
        answers.append(int(value))

    return answers


def parse_gender_text(gender_raw: str | None) -> str:
    if gender_raw == "1":
        return "Laki-laki"
    if gender_raw == "0":
        return "Perempuan"
    return "-"
