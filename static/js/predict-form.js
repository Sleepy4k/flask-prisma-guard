document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("predictionForm");
    if (!form) {
        return;
    }

    const steps = Array.from(form.querySelectorAll(".form-step"));
    const stepIndicators = Array.from(document.querySelectorAll(".step-indicator-item"));
    const stepCounter = document.getElementById("stepCounter");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitTriggerBtn = document.getElementById("submitTriggerBtn");

    const modalEl = document.getElementById("confirmSubmitModal");
    const confirmModal = modalEl ? new bootstrap.Modal(modalEl) : null;

    let currentStep = 0;

    function setInputValidityState(input, isValid, message, markTouched) {
        if (isValid) {
            input.classList.remove("is-invalid");
            return true;
        }

        const hasValue = input.value.trim() !== "";
        if (markTouched || hasValue || input.dataset.touched === "true") {
            input.classList.add("is-invalid");
            const feedback = input.parentElement.querySelector(".invalid-feedback");
            if (feedback && message) {
                feedback.textContent = message;
            }
        }

        return false;
    }

    function validateStudentStep(markTouched) {
        let isStepValid = true;

        const nama = form.elements["nama"];
        const kampus = form.elements["perguruan_tinggi"];
        const prodi = form.elements["program_studi"];
        const gender = form.elements["gender"];
        const usia = form.elements["usia"];
        const semester = form.elements["semester"];
        const ipk = form.elements["ipk"];

        const namaValid = nama.value.trim().length >= 3;
        if (!setInputValidityState(nama, namaValid, "Nama wajib diisi minimal 3 karakter.", markTouched)) {
            isStepValid = false;
        }

        const kampusValid = kampus.value.trim().length >= 2;
        if (!setInputValidityState(kampus, kampusValid, "Perguruan tinggi wajib diisi.", markTouched)) {
            isStepValid = false;
        }

        const prodiValid = prodi.value.trim().length >= 2;
        if (!setInputValidityState(prodi, prodiValid, "Program studi wajib diisi.", markTouched)) {
            isStepValid = false;
        }

        const genderValid = ["0", "1"].includes(gender.value);
        if (!setInputValidityState(gender, genderValid, "Pilih jenis kelamin terlebih dahulu.", markTouched)) {
            isStepValid = false;
        }

        const usiaValue = Number.parseInt(usia.value, 10);
        const usiaValid = Number.isInteger(usiaValue) && usiaValue >= 15 && usiaValue <= 60;
        if (!setInputValidityState(usia, usiaValid, "Usia harus antara 15 sampai 60.", markTouched)) {
            isStepValid = false;
        }

        const semesterValue = Number.parseInt(semester.value, 10);
        const semesterValid = Number.isInteger(semesterValue) && semesterValue >= 1 && semesterValue <= 14;
        if (!setInputValidityState(semester, semesterValid, "Semester harus antara 1 sampai 14.", markTouched)) {
            isStepValid = false;
        }

        const ipkValue = Number.parseFloat(ipk.value);
        const ipkValid = !Number.isNaN(ipkValue) && ipkValue >= 0 && ipkValue <= 4;
        if (!setInputValidityState(ipk, ipkValid, "IPK harus antara 0.00 sampai 4.00.", markTouched)) {
            isStepValid = false;
        }

        return isStepValid;
    }

    function validateSRQStep(stepIndex, markTouched) {
        let isStepValid = true;
        const blocks = steps[stepIndex].querySelectorAll(".question-block");

        blocks.forEach((block) => {
            const questionName = block.dataset.questionName;
            const selected = block.querySelector(`input[name="${questionName}"]:checked`);
            const errorText = block.querySelector(".question-error");

            if (selected) {
                block.classList.remove("question-invalid");
                errorText.classList.add("d-none");
                return;
            }

            isStepValid = false;
            if (markTouched) {
                block.classList.add("question-invalid");
                errorText.classList.remove("d-none");
            }
        });

        return isStepValid;
    }

    function validateStep(stepIndex, markTouched = true) {
        if (stepIndex === 0) {
            return validateStudentStep(markTouched);
        }
        return validateSRQStep(stepIndex, markTouched);
    }

    function validateAllSteps() {
        for (let i = 0; i < steps.length; i += 1) {
            if (!validateStep(i, true)) {
                currentStep = i;
                renderStep();
                return false;
            }
        }
        return true;
    }

    function updateButtons() {
        prevBtn.disabled = currentStep === 0;
        nextBtn.classList.toggle("d-none", currentStep === steps.length - 1);
        submitTriggerBtn.classList.toggle("d-none", currentStep !== steps.length - 1);
    }

    function updateStepIndicators() {
        stepIndicators.forEach((item, index) => {
            item.classList.toggle("active", index === currentStep);
            item.classList.toggle("completed", index < currentStep);
        });

        stepCounter.textContent = `Langkah ${currentStep + 1} dari ${steps.length}`;
    }

    function renderStep() {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
        });

        updateButtons();
        updateStepIndicators();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    nextBtn.addEventListener("click", () => {
        if (!validateStep(currentStep, true)) {
            return;
        }

        if (currentStep < steps.length - 1) {
            currentStep += 1;
            renderStep();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep -= 1;
            renderStep();
        }
    });

    submitTriggerBtn.addEventListener("click", () => {
        if (!validateStep(currentStep, true)) {
            return;
        }

        if (confirmModal) {
            confirmModal.show();
        }
    });

    const studentFields = [
        form.elements["nama"],
        form.elements["perguruan_tinggi"],
        form.elements["program_studi"],
        form.elements["gender"],
        form.elements["usia"],
        form.elements["semester"],
        form.elements["ipk"],
    ];

    studentFields.forEach((field) => {
        if (!field) {
            return;
        }

        const eventName = field.tagName === "SELECT" ? "change" : "input";
        field.addEventListener(eventName, () => {
            field.dataset.touched = "true";
            if (currentStep === 0) {
                validateStudentStep(false);
            }
        });
    });

    const srqRadios = form.querySelectorAll('input[type="radio"][name^="srq_"]');
    srqRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            const questionNumber = Number.parseInt(radio.name.replace("srq_", ""), 10);
            let stepIndex = 1;

            if (questionNumber > 10 && questionNumber <= 20) {
                stepIndex = 2;
            } else if (questionNumber > 20) {
                stepIndex = 3;
            }

            validateSRQStep(stepIndex, false);
        });
    });

    form.addEventListener("submit", (event) => {
        if (!validateAllSteps()) {
            event.preventDefault();
        }
    });

    renderStep();
});
