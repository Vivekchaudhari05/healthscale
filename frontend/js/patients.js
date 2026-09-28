const PATIENT_STORAGE_KEY = "healthscale_patients";

/* =========================================================
GET PATIENTS
========================================================= */

function getPatients() {


const storedPatients =
    localStorage.getItem(PATIENT_STORAGE_KEY);

if (!storedPatients) {
    return [];
}

try {

    return JSON.parse(storedPatients);

} catch (error) {

    console.error(
        "Unable to read patient data:",
        error
    );

    return [];
}


}

/* =========================================================
SAVE PATIENTS
========================================================= */

function savePatients(patients) {


localStorage.setItem(
    PATIENT_STORAGE_KEY,
    JSON.stringify(patients)
);


}

/* =========================================================
GENERATE PATIENT ID
========================================================= */

function generatePatientId() {


const patients = getPatients();

const year = new Date().getFullYear();

const nextNumber =
    patients.length + 1;

return (
    "PAT-" +
    year +
    "-" +
    String(nextNumber).padStart(4, "0")
);


}

/* =========================================================
OPEN PATIENT DRAWER
========================================================= */

function openPatientModal() {


const drawer =
    document.getElementById("patientDrawer");

const modal =
    document.getElementById("patientModal");

if (drawer) {

    drawer.classList.add("open");

}

if (modal) {

    modal.classList.add("open");

    modal.style.display = "flex";

}

document.body.classList.add(
    "patient-modal-open"
);


}

/* =========================================================
CLOSE PATIENT DRAWER
========================================================= */

function closePatientModal() {


const drawer =
    document.getElementById("patientDrawer");

const modal =
    document.getElementById("patientModal");

if (drawer) {

    drawer.classList.remove("open");

}

if (modal) {

    modal.classList.remove("open");

    modal.style.display = "none";

}

document.body.classList.remove(
    "patient-modal-open"
);


}

/* =========================================================
RESET FORM
========================================================= */

function resetPatientForm() {


const form =
    document.getElementById("patientForm");

if (form) {

    form.reset();

}


const patientId =
    document.getElementById("patientId");

if (patientId) {

    patientId.value =
        generatePatientId();

}


}

/* =========================================================
ADD PATIENT
========================================================= */

function addPatient(formData) {


const patients =
    getPatients();


const patient = {

    patient_id:
        generatePatientId(),

    name:
        formData.get("name")?.trim() || "",

    age:
        formData.get("age") || "",

    gender:
        formData.get("gender") || "",

    phone:
        formData.get("phone")?.trim() || "",

    email:
        formData.get("email")?.trim() || "",

    blood_group:
        formData.get("blood_group") || "",

    condition:
        formData.get("condition") ||
        "Stable",

    address:
        formData.get("address")?.trim() || "",

    emergency_contact:
        formData.get("emergency_contact")?.trim() || "",

    medical_notes:
        formData.get("medical_notes")?.trim() || "",

    created_at:
        new Date().toISOString()

};


patients.push(patient);

savePatients(patients);

return patient;


}

/* =========================================================
CONDITION CLASS
========================================================= */

function getConditionClass(condition) {


if (!condition) {

    return "status-stable";

}

const normalized =
    condition.toLowerCase();


if (
    normalized.includes("critical") ||
    normalized.includes("emergency")
) {

    return "status-critical";

}


if (
    normalized.includes("warning") ||
    normalized.includes("attention")
) {

    return "status-warning";

}


return "status-stable";


}

/* =========================================================
RENDER PATIENTS TABLE
========================================================= */

function renderPatients() {


const patients =
    getPatients();


const tableBody =
    document.getElementById(
        "patientsTableBody"
    );


if (!tableBody) {

    console.warn(
        "patientsTableBody not found."
    );

    return;
}


if (patients.length === 0) {

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:40px;
                "
            >

                <div
                    style="
                        color:#94a3b8;
                        font-size:14px;
                    "
                >

                    <div
                        style="
                            font-size:32px;
                            margin-bottom:10px;
                        "
                    >
                        ♙
                    </div>

                    <strong>
                        No patients registered
                    </strong>

                    <div
                        style="
                            margin-top:6px;
                            font-size:12px;
                        "
                    >
                        Click "Add Patient" to
                        register a new patient.
                    </div>

                </div>

            </td>

        </tr>

    `;

    updatePatientStatistics(
        patients
    );

    return;
}


tableBody.innerHTML =
    patients.map(function(patient) {

        const conditionClass =
            getConditionClass(
                patient.condition
            );


        return `

            <tr>

                <td>

                    <strong>
                        ${escapeHtml(
                            patient.patient_id
                        )}
                    </strong>

                </td>


                <td>

                    <strong>
                        ${escapeHtml(
                            patient.name
                        )}
                    </strong>

                </td>


                <td>
                    ${escapeHtml(
                        patient.age
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        patient.gender
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        patient.phone
                    )}
                </td>


                <td>

                    <span
                        class="status-badge
                        ${conditionClass}"
                    >

                        ${escapeHtml(
                            patient.condition
                        )}

                    </span>

                </td>


                <td>

                    ${formatPatientDate(
                        patient.created_at
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="view-patient-btn"
                        onclick="viewPatient('${escapeAttribute(patient.patient_id)}')"
                    >

                        View

                    </button>

                </td>

            </tr>

        `;

    }).join("");


updatePatientStatistics(
    patients
);


}

/* =========================================================
UPDATE PATIENT STATISTICS
========================================================= */

function updatePatientStatistics(
patients
) {


const total =
    patients.length;


const stable =
    patients.filter(function(patient) {

        return getConditionClass(
            patient.condition
        ) === "status-stable";

    }).length;


const attention =
    patients.filter(function(patient) {

        return getConditionClass(
            patient.condition
        ) === "status-warning";

    }).length;


const critical =
    patients.filter(function(patient) {

        return getConditionClass(
            patient.condition
        ) === "status-critical";

    }).length;


const totalElement =
    document.getElementById(
        "totalPatients"
    );

const stableElement =
    document.getElementById(
        "stablePatients"
    );

const attentionElement =
    document.getElementById(
        "attentionPatients"
    );

const criticalElement =
    document.getElementById(
        "criticalPatients"
    );


if (totalElement) {

    totalElement.textContent =
        total;

}


if (stableElement) {

    stableElement.textContent =
        stable;

}


if (attentionElement) {

    attentionElement.textContent =
        attention;

}


if (criticalElement) {

    criticalElement.textContent =
        critical;

}


}

/* =========================================================
VIEW PATIENT
========================================================= */

function viewPatient(patientId) {


const patients =
    getPatients();


const patient =
    patients.find(function(item) {

        return item.patient_id === patientId;

    });


if (!patient) {

    alert(
        "Patient information could not be found."
    );

    return;
}


alert(

    "Patient Profile\n\n" +

    "Patient ID: " +
    patient.patient_id +

    "\nName: " +
    patient.name +

    "\nAge: " +
    patient.age +

    "\nGender: " +
    patient.gender +

    "\nBlood Group: " +
    (
        patient.blood_group ||
        "Not set"
    ) +

    "\nPhone: " +
    patient.phone +

    "\nCondition: " +
    patient.condition

);


}

/* =========================================================
FORMAT DATE
========================================================= */

function formatPatientDate(
dateValue
) {


if (!dateValue) {

    return "--";

}


try {

    const date =
        new Date(dateValue);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

} catch (error) {

    return "--";

}


}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHtml(value) {


if (
    value === null ||
    value === undefined
) {

    return "";

}


return String(value)

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );


}

/* =========================================================
ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {


return String(value)
    .replace(
        /'/g,
        "\\'"
    );


}

/* =========================================================
SHOW TOAST
========================================================= */

function showPatientToast(
message
) {


const toast =
    document.getElementById(
        "patientToast"
    );


if (!toast) {

    alert(message);

    return;
}


toast.textContent =
    message;


toast.classList.add(
    "show"
);


setTimeout(function() {

    toast.classList.remove(
        "show"
    );

}, 3000);


}

/* =========================================================
DOCUMENT READY
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function() {


    console.log(
        "HealthScale Patients page loaded"
    );


    /* ---------- INITIAL RENDER ---------- */

    renderPatients();


    /* ---------- ADD PATIENT BUTTON ---------- */

    const addPatientButton =
        document.getElementById(
            "addPatientButton"
        );


    if (addPatientButton) {

        addPatientButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                resetPatientForm();

                openPatientModal();

            }
        );

    } else {

        console.warn(
            "addPatientButton not found."
        );

    }


    /* ---------- CLOSE BUTTON ---------- */

    const closePatientButton =
        document.getElementById(
            "closePatientButton"
        );


    if (closePatientButton) {

        closePatientButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closePatientModal();

            }
        );

    }


    /* ---------- CANCEL BUTTON ---------- */

    const cancelPatientButton =
        document.getElementById(
            "cancelPatientButton"
        );


    if (cancelPatientButton) {

        cancelPatientButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closePatientModal();

            }
        );

    }


    /* ---------- MODAL BACKDROP ---------- */

    const modal =
        document.getElementById(
            "patientModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === modal
                ) {

                    closePatientModal();

                }

            }
        );

    }


    /* ---------- PATIENT FORM ---------- */

    const patientForm =
        document.getElementById(
            "patientForm"
        );


    if (patientForm) {

        patientForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const formData =
                    new FormData(
                        patientForm
                    );


                const name =
                    formData.get("name")
                    ?.trim();


                const age =
                    formData.get("age");


                const gender =
                    formData.get("gender");


                const phone =
                    formData.get("phone")
                    ?.trim();


                if (
                    !name ||
                    !age ||
                    !gender ||
                    !phone
                ) {

                    alert(
                        "Please fill all required patient fields."
                    );

                    return;
                }


                const patient =
                    addPatient(
                        formData
                    );


                console.log(
                    "Patient created:",
                    patient
                );


                renderPatients();


                closePatientModal();


                showPatientToast(

                    "Patient added successfully! " +
                    patient.patient_id

                );

            }
        );

    } else {

        console.warn(
            "patientForm not found."
        );

    }


    /* ---------- REFRESH BUTTON ---------- */

    const refreshPatientsButton =
        document.getElementById(
            "refreshPatientsButton"
        );


    if (refreshPatientsButton) {

        refreshPatientsButton.addEventListener(
            "click",
            function() {

                renderPatients();

            }
        );

    }


    /* ---------- ESC KEY ---------- */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closePatientModal();

            }

        }
    );

}


);
