import {
    FiPlus,
    FiSearch,
    FiRefreshCw,
    FiEdit3,
    FiTrash2,
    FiX,
    FiUser,
    FiCalendar,
    FiFileText,
    FiClock,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";

import { useEffect, useMemo, useState } from "react";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorPrescriptions() {
    const { t, language } = useLanguage();

    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingFormData, setLoadingFormData] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingPrescription, setEditingPrescription] =
        useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const createEmptyItem = () => ({
        medicine_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
    });

    const [form, setForm] = useState({
        patient_id: "",
        appointment_id: "",
        items: [createEmptyItem()],
    });

    /* =========================================================
       LOAD PRESCRIPTIONS
    ========================================================= */

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await doctorService.getPrescriptions();

            const prescriptionsData = Array.isArray(data)
                ? data
                : data?.data &&
                  Array.isArray(data.data)
                ? data.data
                : data?.prescriptions || [];

            setPrescriptions(prescriptionsData);
        } catch (error) {
            console.error(
                "Failed to load prescriptions:",
                error
            );

            setPrescriptions([]);

            setError(
                error.response?.data?.message ||
                    t("prescriptions.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       LOAD FORM DATA
    ========================================================= */

    const loadFormData = async () => {
        try {
            setLoadingFormData(true);
            setFormError("");

            const [
                patientsData,
                appointmentsResponse,
            ] = await Promise.all([
                doctorService.getPatients(),

                doctorService.getAppointments({
                    per_page: 50,
                }),
            ]);

            const patientsList = Array.isArray(
                patientsData
            )
                ? patientsData
                : patientsData?.patients || [];

            let appointmentsList = [];

            if (
                Array.isArray(
                    appointmentsResponse?.data?.data
                )
            ) {
                appointmentsList =
                    appointmentsResponse.data.data;
            } else if (
                Array.isArray(
                    appointmentsResponse?.data
                )
            ) {
                appointmentsList =
                    appointmentsResponse.data;
            } else if (
                Array.isArray(appointmentsResponse)
            ) {
                appointmentsList =
                    appointmentsResponse;
            }

            setPatients(patientsList);
            setAppointments(appointmentsList);
        } catch (error) {
            console.error(
                "Failed to load prescription form data:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                    t("prescriptions.formDataFailed")
            );
        } finally {
            setLoadingFormData(false);
        }
    };

    /* =========================================================
       OPEN CREATE
    ========================================================= */

    const handleOpenCreate = async () => {
        setEditingPrescription(null);

        setForm({
            patient_id: "",
            appointment_id: "",
            items: [createEmptyItem()],
        });

        setFormError("");
        setShowForm(true);

        await loadFormData();
    };

    /* =========================================================
       NORMALIZE PRESCRIPTION ITEMS
    ========================================================= */

    const normalizePrescriptionItems = (
        prescription
    ) => {
        if (
            Array.isArray(prescription?.items) &&
            prescription.items.length > 0
        ) {
            return prescription.items.map((item) => ({
                medicine_name:
                    item?.medicine_name || "",

                dosage:
                    item?.dosage || "",

                frequency:
                    item?.frequency || "",

                duration:
                    item?.duration || "",

                instructions:
                    item?.instructions || "",
            }));
        }

        return [
            {
                medicine_name:
                    prescription?.medicine_name || "",

                dosage:
                    prescription?.dosage || "",

                frequency:
                    prescription?.frequency || "",

                duration:
                    prescription?.duration || "",

                instructions:
                    prescription?.instructions || "",
            },
        ];
    };

    /* =========================================================
       OPEN EDIT
    ========================================================= */

    const handleOpenEdit = async (
        prescription
    ) => {
        setEditingPrescription(prescription);

        setForm({
            patient_id:
                prescription.patient?.id ??
                prescription.patient_id ??
                "",

            appointment_id:
                prescription.appointment?.id ??
                prescription.appointment_id ??
                "",

            items:
                normalizePrescriptionItems(
                    prescription
                ),
        });

        setFormError("");
        setShowForm(true);

        await loadFormData();
    };

    /* =========================================================
       CLOSE FORM
    ========================================================= */

    const handleCloseForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingPrescription(null);
        setFormError("");
    };

    /* =========================================================
       FORM CHANGE
    ========================================================= */

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "patient_id") {
            setForm((current) => ({
                ...current,
                patient_id: value,
                appointment_id: "",
            }));

            return;
        }

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    /* =========================================================
       ITEM CHANGE
    ========================================================= */

    const handleItemChange = (
        index,
        field,
        value
    ) => {
        setForm((current) => {
            const updatedItems = [...current.items];

            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value,
            };

            return {
                ...current,
                items: updatedItems,
            };
        });
    };

    /* =========================================================
       ADD ITEM
    ========================================================= */

    const handleAddItem = () => {
        setForm((current) => ({
            ...current,
            items: [
                ...current.items,
                createEmptyItem(),
            ],
        }));
    };

    /* =========================================================
       REMOVE ITEM
    ========================================================= */

    const handleRemoveItem = (index) => {
        setForm((current) => {
            if (current.items.length === 1) {
                return current;
            }

            return {
                ...current,
                items: current.items.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
            };
        });
    };

    /* =========================================================
       SELECTED PATIENT APPOINTMENTS
    ========================================================= */

    const selectedPatientAppointments =
        useMemo(() => {
            if (!form.patient_id) {
                return [];
            }

            return appointments.filter(
                (appointment) => {
                    const patientId =
                        appointment.patient?.id ??
                        appointment.patient_id;

                    return (
                        String(patientId) ===
                        String(form.patient_id)
                    );
                }
            );
        }, [
            appointments,
            form.patient_id,
        ]);

    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        if (!form.patient_id) {
            setFormError(
                t("prescriptions.selectPatientError")
            );

            return;
        }

        if (
            !Array.isArray(form.items) ||
            form.items.length === 0
        ) {
            setFormError(
                t("prescriptions.addMedicineError")
            );

            return;
        }

        const hasEmptyMedicine = form.items.some(
            (item) =>
                !item.medicine_name?.trim()
        );

        if (hasEmptyMedicine) {
            setFormError(
                t("prescriptions.medicineNameError")
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                patient_id:
                    Number(form.patient_id),

                appointment_id:
                    form.appointment_id
                        ? Number(
                              form.appointment_id
                          )
                        : null,

                items: form.items.map(
                    (item) => ({
                        medicine_name:
                            item.medicine_name.trim(),

                        dosage:
                            item.dosage?.trim() ||
                            null,

                        frequency:
                            item.frequency?.trim() ||
                            null,

                        duration:
                            item.duration?.trim() ||
                            null,

                        instructions:
                            item.instructions?.trim() ||
                            null,
                    })
                ),
            };

            if (editingPrescription) {
                await doctorService.updatePrescription(
                    editingPrescription.id,
                    payload
                );
            } else {
                await doctorService.createPrescription(
                    payload
                );
            }

            await loadPrescriptions();

            handleCloseForm();
        } catch (error) {
            console.error(
                "Failed to save prescription:",
                error
            );

            const responseData =
                error.response?.data;

            let message =
                responseData?.message ||
                t("prescriptions.saveFailed");

            if (
                responseData?.errors &&
                typeof responseData.errors ===
                    "object"
            ) {
                const firstError =
                    Object.values(
                        responseData.errors
                    )[0];

                if (
                    Array.isArray(firstError)
                ) {
                    message =
                        firstError[0];
                } else if (
                    typeof firstError ===
                    "string"
                ) {
                    message = firstError;
                }
            }

            setFormError(message);
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                t("prescriptions.deleteConfirm")
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            await doctorService.deletePrescription(
                id
            );

            await loadPrescriptions();
        } catch (error) {
            console.error(
                "Failed to delete prescription:",
                error
            );

            setError(
                error.response?.data?.message ||
                    t("prescriptions.deleteFailed")
            );
        } finally {
            setDeletingId(null);
        }
    };

    /* =========================================================
       SEARCH
    ========================================================= */

    const filteredPrescriptions =
        useMemo(() => {
            const value = search
                .trim()
                .toLowerCase();

            if (!value) {
                return prescriptions;
            }

            return prescriptions.filter(
                (prescription) => {
                    const patientName =
                        prescription.patient
                            ?.user?.name ||
                        "";

                    const items =
                        Array.isArray(
                            prescription.items
                        )
                            ? prescription.items
                            : normalizePrescriptionItems(
                                  prescription
                              );

                    const medicineText =
                        items
                            .map(
                                (item) =>
                                    `${item.medicine_name || ""} ${
                                        item.dosage || ""
                                    } ${
                                        item.frequency || ""
                                    }`
                            )
                            .join(" ");

                    return (
                        patientName
                            .toLowerCase()
                            .includes(value) ||
                        medicineText
                            .toLowerCase()
                            .includes(value)
                    );
                }
            );
        }, [
            prescriptions,
            search,
        ]);

    /* =========================================================
       HELPERS
    ========================================================= */

    const getPatientName = (
        prescription
    ) => {
        return (
            prescription.patient?.user
                ?.name ||
            prescription.patient?.name ||
            t("prescriptions.unknownPatient")
        );
    };

    const getAppointmentLabel = (
        appointment
    ) => {
        if (!appointment) {
            return "";
        }

        const date =
            appointment.appointment_date ||
            "";

        const time =
            appointment.appointment_time ||
            "";

        const type =
            appointment.type || "";

        return [
            date,
            time?.slice(0, 5),
            type,
        ]
            .filter(Boolean)
            .join(" • ");
    };

    const getPrescriptionItems = (
        prescription
    ) => {
        return normalizePrescriptionItems(
            prescription
        );
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="doctor-prescriptions-page">

            {/* HEADER */}

            <div className="doctor-prescriptions-header">
                <div>
                    <h1>
                        {t("prescriptions.title")}
                    </h1>

                    <p>
                        {t("prescriptions.description")}
                    </p>
                </div>

                <div className="doctor-prescriptions-header-actions">

                    <button
                        type="button"
                        className="doctor-prescriptions-secondary-button"
                        onClick={
                            loadPrescriptions
                        }
                        disabled={loading}
                    >
                        <FiRefreshCw
                            size={16}
                            className={
                                loading
                                    ? "doctor-spin"
                                    : ""
                            }
                        />

                        {t("prescriptions.refresh")}
                    </button>

                    <button
                        type="button"
                        className="doctor-prescriptions-primary-button"
                        onClick={
                            handleOpenCreate
                        }
                    >
                        <FiPlus size={17} />

                        {t("prescriptions.newPrescription")}
                    </button>

                </div>
            </div>

            {/* SUMMARY */}

            <div className="doctor-prescriptions-summary">

                <div className="doctor-prescriptions-summary-card">

                    <div className="doctor-prescriptions-summary-icon">
                        <FiFileText />
                    </div>

                    <div>
                        <span>
                            {t("prescriptions.totalPrescriptions")}
                        </span>

                        <strong>
                            {
                                prescriptions.length
                            }
                        </strong>
                    </div>

                </div>

                <div className="doctor-prescriptions-summary-card">

                    <div className="doctor-prescriptions-summary-icon">
                        <FiUser />
                    </div>

                    <div>
                        <span>
                            {t("prescriptions.patients")}
                        </span>

                        <strong>
                            {
                                new Set(
                                    prescriptions
                                        .map(
                                            (
                                                prescription
                                            ) =>
                                                prescription
                                                    .patient
                                                    ?.id ??
                                                prescription.patient_id
                                        )
                                        .filter(
                                            Boolean
                                        )
                                ).size
                            }
                        </strong>
                    </div>

                </div>

            </div>

            {/* TOOLBAR */}

            <div className="doctor-prescriptions-toolbar">

                <div className="doctor-prescriptions-search">

                    <FiSearch size={17} />

                    <input
                        type="text"
                        placeholder={t(
                            "prescriptions.searchPlaceholder"
                        )}
                        value={search}
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target
                                    .value
                            )
                        }
                    />

                </div>

                <div className="doctor-prescriptions-count">
                    {
                        filteredPrescriptions.length
                    }{" "}
                    {filteredPrescriptions.length === 1
                        ? t("prescriptions.prescription")
                        : t("prescriptions.prescriptions")}
                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="doctor-prescriptions-error">

                    <FiAlertCircle size={17} />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={
                            loadPrescriptions
                        }
                    >
                        {t("prescriptions.retry")}
                    </button>

                </div>
            )}

            {/* LOADING / EMPTY / DATA */}

            {loading ? (
                <div className="doctor-prescriptions-loading">

                    <div className="doctor-prescriptions-spinner"></div>

                    <p>
                        {t("prescriptions.loading")}
                    </p>

                </div>
            ) : filteredPrescriptions.length ===
              0 ? (
                <div className="doctor-prescriptions-empty">

                    <div className="doctor-prescriptions-empty-icon">
                        <FiFileText />
                    </div>

                    <h3>
                        {search
                            ? t("prescriptions.noPrescriptionsFound")
                            : t("prescriptions.noPrescriptionsYet")}
                    </h3>

                    <p>
                        {search
                            ? t("prescriptions.searchEmpty")
                            : t("prescriptions.createFirst")}
                    </p>

                    {!search && (
                        <button
                            type="button"
                            className="doctor-prescriptions-primary-button"
                            onClick={
                                handleOpenCreate
                            }
                        >
                            <FiPlus size={17} />

                            {t("prescriptions.newPrescription")}
                        </button>
                    )}

                </div>
            ) : (
                <div className="doctor-prescriptions-grid">

                    {filteredPrescriptions.map(
                        (prescription) => {
                            const items =
                                getPrescriptionItems(
                                    prescription
                                );

                            return (
                                <div
                                    className="doctor-prescription-card"
                                    key={
                                        prescription.id
                                    }
                                >

                                    {/* CARD HEADER */}

                                    <div className="doctor-prescription-card-header">

                                        <div className="doctor-prescription-patient">

                                            <div className="doctor-prescription-patient-icon">
                                                <FiUser />
                                            </div>

                                            <div>
                                                <h3>
                                                    {getPatientName(
                                                        prescription
                                                    )}
                                                </h3>

                                                <span>
                                                    {t("prescriptions.prescription")}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="doctor-prescription-card-actions">

                                            <button
                                                type="button"
                                                title={t(
                                                    "prescriptions.edit"
                                                )}
                                                onClick={() =>
                                                    handleOpenEdit(
                                                        prescription
                                                    )
                                                }
                                            >
                                                <FiEdit3
                                                    size={16}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="delete"
                                                title={t(
                                                    "prescriptions.delete"
                                                )}
                                                onClick={() =>
                                                    handleDelete(
                                                        prescription.id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    prescription.id
                                                }
                                            >
                                                <FiTrash2
                                                    size={16}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    {/* MEDICINES */}

                                    <div className="doctor-prescription-medicine">

                                        <div className="doctor-prescription-medicine-icon">
                                            <FiFileText />
                                        </div>

                                        <div>
                                            <span>
                                                {t("prescriptions.medicines")}
                                            </span>

                                            <strong>
                                                {
                                                    items.length
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="doctor-prescription-items-list">

                                        {items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    className="doctor-prescription-item"
                                                    key={
                                                        index
                                                    }
                                                >

                                                    <div className="doctor-prescription-item-title">
                                                        <FiCheckCircle
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        <strong>
                                                            {
                                                                item.medicine_name
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div className="doctor-prescription-details">

                                                        <div>
                                                            <span>
                                                                {t("prescriptions.dosage")}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    item.dosage ||
                                                                    "—"
                                                                }
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {t("prescriptions.frequency")}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    item.frequency ||
                                                                    "—"
                                                                }
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {t("prescriptions.duration")}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    item.duration ||
                                                                    "—"
                                                                }
                                                            </strong>
                                                        </div>

                                                    </div>

                                                    {item.instructions && (
                                                        <div className="doctor-prescription-instructions">

                                                            <div className="doctor-prescription-instructions-title">

                                                                <FiFileText
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {t("prescriptions.instructions")}

                                                            </div>

                                                            <p>
                                                                {
                                                                    item.instructions
                                                                }
                                                            </p>

                                                        </div>
                                                    )}

                                                </div>
                                            )
                                        )}

                                    </div>

                                    {/* APPOINTMENT */}

                                    {prescription.appointment && (
                                        <div className="doctor-prescription-appointment">

                                            <FiCalendar
                                                size={15}
                                            />

                                            <span>
                                                {
                                                    getAppointmentLabel(
                                                        prescription.appointment
                                                    )
                                                }
                                            </span>

                                        </div>
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>
            )}

            {/* MODAL */}

            {showForm && (
                <div
                    className="doctor-prescription-modal-overlay"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseForm();
                        }
                    }}
                >

                    <div className="doctor-prescription-modal">

                        {/* MODAL HEADER */}

                        <div className="doctor-prescription-modal-header">

                            <div>
                                <h2>
                                    {editingPrescription
                                        ? t("prescriptions.editPrescription")
                                        : t("prescriptions.newPrescription")}
                                </h2>

                                <p>
                                    {t("prescriptions.modalDescription")}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseForm
                                }
                                disabled={saving}
                            >
                                <FiX size={20} />
                            </button>

                        </div>

                        {/* FORM ERROR */}

                        {formError && (
                            <div className="doctor-prescription-form-error">

                                <FiAlertCircle
                                    size={17}
                                />

                                <span>
                                    {formError}
                                </span>

                            </div>
                        )}

                        {loadingFormData ? (
                            <div className="doctor-prescription-form-loading">

                                <div className="doctor-prescriptions-spinner"></div>

                                <p>
                                    {t(
                                        "prescriptions.loadingFormData"
                                    )}
                                </p>

                            </div>
                        ) : (
                            <form
                                className="doctor-prescription-form"
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                {/* PATIENT */}

                                <div className="doctor-prescription-form-group">

                                    <label htmlFor="prescription_patient_id">
                                        {t("prescriptions.patient")}
                                    </label>

                                    <div className="doctor-prescription-select-wrapper">

                                        <FiUser
                                            className="doctor-prescription-select-icon"
                                            size={17}
                                        />

                                        <select
                                            id="prescription_patient_id"
                                            name="patient_id"
                                            value={
                                                form.patient_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            disabled={
                                                !!editingPrescription
                                            }
                                        >
                                            <option value="">
                                                {t(
                                                    "prescriptions.selectPatient"
                                                )}
                                            </option>

                                            {patients.map(
                                                (
                                                    patient
                                                ) => (
                                                    <option
                                                        key={
                                                            patient.id
                                                        }
                                                        value={
                                                            patient.id
                                                        }
                                                    >
                                                        {patient
                                                            .user
                                                            ?.name ||
                                                            `${t(
                                                                "prescriptions.patient"
                                                            )} #${patient.id}`}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                    </div>

                                </div>

                                {/* APPOINTMENT */}

                                <div className="doctor-prescription-form-group">

                                    <label htmlFor="prescription_appointment_id">
                                        {t("prescriptions.appointment")}
                                    </label>

                                    <div className="doctor-prescription-select-wrapper">

                                        <FiCalendar
                                            className="doctor-prescription-select-icon"
                                            size={17}
                                        />

                                        <select
                                            id="prescription_appointment_id"
                                            name="appointment_id"
                                            value={
                                                form.appointment_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !form.patient_id ||
                                                selectedPatientAppointments.length ===
                                                    0
                                            }
                                        >
                                            <option value="">
                                                {!form.patient_id
                                                    ? t(
                                                          "prescriptions.selectPatientFirst"
                                                      )
                                                    : selectedPatientAppointments.length ===
                                                      0
                                                    ? t(
                                                          "prescriptions.noAppointments"
                                                      )
                                                    : t(
                                                          "prescriptions.selectAppointment"
                                                      )}
                                            </option>

                                            {selectedPatientAppointments.map(
                                                (
                                                    appointment
                                                ) => (
                                                    <option
                                                        key={
                                                            appointment.id
                                                        }
                                                        value={
                                                            appointment.id
                                                        }
                                                    >
                                                        {getAppointmentLabel(
                                                            appointment
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                    </div>

                                </div>

                                {/* MEDICINES */}

                                <div className="doctor-prescription-items-section doctor-prescription-full-width">

                                    <div className="doctor-prescription-items-header">

                                        <div>
                                            <h3>
                                                {t("prescriptions.medicines")}
                                            </h3>

                                            <p>
                                                {t(
                                                    "prescriptions.medicinesDescription"
                                                )}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="doctor-prescriptions-secondary-button"
                                            onClick={
                                                handleAddItem
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            <FiPlus
                                                size={16}
                                            />

                                            {t(
                                                "prescriptions.addMedicine"
                                            )}
                                        </button>

                                    </div>

                                    <div className="doctor-prescription-form-items">

                                        {form.items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    className="doctor-prescription-form-item"
                                                    key={
                                                        index
                                                    }
                                                >

                                                    <div className="doctor-prescription-form-item-header">

                                                        <div className="doctor-prescription-form-item-number">
                                                            {index +
                                                                1}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {t(
                                                                    "prescriptions.medicineNumber"
                                                                )}{" "}
                                                                {index +
                                                                    1}
                                                            </strong>

                                                            <span>
                                                                {t(
                                                                    "prescriptions.medicationDetails"
                                                                )}
                                                            </span>
                                                        </div>

                                                        {form.items
                                                            .length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                className="doctor-prescription-remove-item"
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    saving
                                                                }
                                                                title={t(
                                                                    "prescriptions.removeMedicine"
                                                                )}
                                                            >
                                                                <FiTrash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        )}

                                                    </div>

                                                    {/* MEDICINE NAME */}

                                                    <div className="doctor-prescription-form-group doctor-prescription-full-width">

                                                        <label
                                                            htmlFor={`medicine_name_${index}`}
                                                        >
                                                            {t(
                                                                "prescriptions.medicine"
                                                            )}
                                                        </label>

                                                        <div className="doctor-prescription-input-wrapper">

                                                            <FiFileText
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                            <input
                                                                id={`medicine_name_${index}`}
                                                                type="text"
                                                                value={
                                                                    item.medicine_name
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "medicine_name",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "prescriptions.medicinePlaceholder"
                                                                )}
                                                                required
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* DOSAGE */}

                                                    <div className="doctor-prescription-form-group">

                                                        <label
                                                            htmlFor={`dosage_${index}`}
                                                        >
                                                            {t(
                                                                "prescriptions.dosage"
                                                            )}
                                                        </label>

                                                        <div className="doctor-prescription-input-wrapper">

                                                            <FiCheckCircle
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                            <input
                                                                id={`dosage_${index}`}
                                                                type="text"
                                                                value={
                                                                    item.dosage
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "dosage",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "prescriptions.dosagePlaceholder"
                                                                )}
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* FREQUENCY */}

                                                    <div className="doctor-prescription-form-group">

                                                        <label
                                                            htmlFor={`frequency_${index}`}
                                                        >
                                                            {t(
                                                                "prescriptions.frequency"
                                                            )}
                                                        </label>

                                                        <div className="doctor-prescription-input-wrapper">

                                                            <FiClock
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                            <input
                                                                id={`frequency_${index}`}
                                                                type="text"
                                                                value={
                                                                    item.frequency
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "frequency",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "prescriptions.frequencyPlaceholder"
                                                                )}
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* DURATION */}

                                                    <div className="doctor-prescription-form-group">

                                                        <label
                                                            htmlFor={`duration_${index}`}
                                                        >
                                                            {t(
                                                                "prescriptions.duration"
                                                            )}
                                                        </label>

                                                        <div className="doctor-prescription-input-wrapper">

                                                            <FiClock
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                            <input
                                                                id={`duration_${index}`}
                                                                type="text"
                                                                value={
                                                                    item.duration
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "duration",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "prescriptions.durationPlaceholder"
                                                                )}
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* INSTRUCTIONS */}

                                                    <div className="doctor-prescription-form-group doctor-prescription-full-width">

                                                        <label
                                                            htmlFor={`instructions_${index}`}
                                                        >
                                                            {t(
                                                                "prescriptions.instructions"
                                                            )}
                                                        </label>

                                                        <textarea
                                                            id={`instructions_${index}`}
                                                            value={
                                                                item.instructions
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "instructions",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "prescriptions.instructionsPlaceholder"
                                                            )}
                                                            rows={
                                                                3
                                                            }
                                                        />

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="doctor-prescription-form-actions">

                                    <button
                                        type="button"
                                        className="doctor-prescription-cancel-button"
                                        onClick={
                                            handleCloseForm
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        {t("prescriptions.cancel")}
                                    </button>

                                    <button
                                        type="submit"
                                        className="doctor-prescription-save-button"
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving ? (
                                            <>
                                                <span className="doctor-prescription-button-spinner"></span>

                                                {t(
                                                    "prescriptions.saving"
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle
                                                    size={
                                                        16
                                                    }
                                                />

                                                {editingPrescription
                                                    ? t(
                                                          "prescriptions.updatePrescription"
                                                      )
                                                    : t(
                                                          "prescriptions.createPrescription"
                                                      )}
                                            </>
                                        )}
                                    </button>

                                </div>

                            </form>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default DoctorPrescriptions;
``
