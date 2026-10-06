import { useEffect, useMemo, useState } from "react";

import {
    FiFileText,
    FiSearch,
    FiCalendar,
    FiUser,
    FiClock,
    FiPlus,
    FiEdit3,
    FiTrash2,
    FiRefreshCw,
    FiAlertCircle,
    FiX,
    FiChevronDown,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorMedicalRecords() {
    const { t, language } = useLanguage();

    const [records, setRecords] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingFormData, setLoadingFormData] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        patient_id: "",
        appointment_id: "",
        diagnosis: "",
        treatment: "",
        notes: "",
    });

    // ========================================
    // LOAD MEDICAL RECORDS
    // ========================================

    const loadRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await doctorService.getMedicalRecords();

            setRecords(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Doctor medical records error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("medicalRecords.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    // ========================================
    // LOAD FORM DATA
    // ========================================

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

            setPatients(
                Array.isArray(patientsData)
                    ? patientsData
                    : []
            );

            let appointmentData = [];

            if (
                Array.isArray(
                    appointmentsResponse?.data
                )
            ) {
                appointmentData =
                    appointmentsResponse.data;
            } else if (
                Array.isArray(appointmentsResponse)
            ) {
                appointmentData =
                    appointmentsResponse;
            } else if (
                Array.isArray(
                    appointmentsResponse?.data?.data
                )
            ) {
                appointmentData =
                    appointmentsResponse.data.data;
            }

            setAppointments(appointmentData);
        } catch (err) {
            console.error(
                "Medical record form data error:",
                err
            );

            setFormError(
                err.response?.data?.message ||
                    t("medicalRecords.formDataFailed")
            );
        } finally {
            setLoadingFormData(false);
        }
    };

    // ========================================
    // FILTER RECORDS
    // ========================================

    const filteredRecords = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return records;
        }

        return records.filter((record) => {
            const patientName =
                record.patient?.user?.name?.toLowerCase() ||
                "";

            const diagnosis =
                record.diagnosis?.toLowerCase() ||
                "";

            const treatment =
                record.treatment?.toLowerCase() ||
                "";

            const notes =
                record.notes?.toLowerCase() ||
                "";

            return (
                patientName.includes(query) ||
                diagnosis.includes(query) ||
                treatment.includes(query) ||
                notes.includes(query)
            );
        });
    }, [records, search]);

    // ========================================
    // FILTER APPOINTMENTS BY PATIENT
    // ========================================

    const selectedPatientAppointments =
        useMemo(() => {
            if (!form.patient_id) {
                return [];
            }

            return appointments.filter(
                (appointment) =>
                    String(
                        appointment.patient?.id ??
                            appointment.patient_id
                    ) ===
                    String(form.patient_id)
            );
        }, [appointments, form.patient_id]);

    // ========================================
    // FORMATTERS
    // ========================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    const formatTime = (time) => {
        if (!time) {
            return "-";
        }

        return time.slice(0, 5);
    };

    const getAppointmentLabel = (appointment) => {
        const date = appointment.appointment_date
            ? formatDate(
                  appointment.appointment_date
              )
            : t("medicalRecords.noDate");

        const time = appointment.appointment_time
            ? formatTime(
                  appointment.appointment_time
              )
            : t("medicalRecords.noTime");

        const type =
            appointment.type ||
            t("medicalRecords.appointment");

        return `${date} • ${time} • ${type}`;
    };

    // ========================================
    // OPEN CREATE
    // ========================================

    const handleOpenCreate = async () => {
        setEditingRecord(null);

        setForm({
            patient_id: "",
            appointment_id: "",
            diagnosis: "",
            treatment: "",
            notes: "",
        });

        setFormError("");
        setShowForm(true);

        await loadFormData();
    };

    // ========================================
    // OPEN EDIT
    // ========================================

    const handleOpenEdit = async (record) => {
        setEditingRecord(record);

        setForm({
            patient_id:
                record.patient_id ||
                record.patient?.id ||
                "",

            appointment_id:
                record.appointment_id ||
                record.appointment?.id ||
                "",

            diagnosis:
                record.diagnosis || "",

            treatment:
                record.treatment || "",

            notes:
                record.notes || "",
        });

        setFormError("");
        setShowForm(true);

        await loadFormData();
    };

    // ========================================
    // CLOSE FORM
    // ========================================

    const handleCloseForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingRecord(null);
        setFormError("");
    };

    // ========================================
    // FORM CHANGE
    // ========================================

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        if (name === "patient_id") {
            setForm((current) => ({
                ...current,
                patient_id: value,
                appointment_id: "",
            }));
        } else {
            setForm((current) => ({
                ...current,
                [name]: value,
            }));
        }

        setFormError("");
    };

    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setFormError("");
            setError("");

            if (!form.patient_id) {
                setFormError(
                    t("medicalRecords.selectPatient")
                );

                return;
            }

            const payload = {
                patient_id: Number(
                    form.patient_id
                ),

                appointment_id:
                    form.appointment_id
                        ? Number(
                              form.appointment_id
                          )
                        : null,

                diagnosis:
                    form.diagnosis || null,

                treatment:
                    form.treatment || null,

                notes:
                    form.notes || null,
            };

            if (editingRecord) {
                await doctorService.updateMedicalRecord(
                    editingRecord.id,
                    payload
                );
            } else {
                await doctorService.createMedicalRecord(
                    payload
                );
            }

            setShowForm(false);
            setEditingRecord(null);

            await loadRecords();
        } catch (err) {
            console.error(
                "Save medical record error:",
                err
            );

            const validationErrors =
                err.response?.data?.errors;

            if (validationErrors) {
                const firstError =
                    Object.values(
                        validationErrors
                    )?.[0]?.[0];

                setFormError(
                    firstError ||
                        t(
                            "medicalRecords.checkData"
                        )
                );
            } else {
                setFormError(
                    err.response?.data?.message ||
                        t(
                            "medicalRecords.saveFailed"
                        )
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // DELETE
    // ========================================

    const handleDelete = async (record) => {
        const patientName =
            record.patient?.user?.name ||
            t("medicalRecords.thisPatient");

        const confirmed = window.confirm(
            `${t(
                "medicalRecords.deleteConfirm"
            )} ${patientName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await doctorService.deleteMedicalRecord(
                record.id
            );

            await loadRecords();
        } catch (err) {
            console.error(
                "Delete medical record error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t(
                        "medicalRecords.deleteFailed"
                    )
            );
        }
    };

    return (
        <div className="doctor-medical-records-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="doctor-page-header">
                <div>
                    <span className="doctor-page-eyebrow">
                        {t(
                            "medicalRecords.eyebrow"
                        )}
                    </span>

                    <h1>
                        {t(
                            "medicalRecords.title"
                        )}
                    </h1>

                    <p>
                        {t(
                            "medicalRecords.description"
                        )}
                    </p>
                </div>

                <div className="doctor-medical-records-header-actions">

                    <button
                        type="button"
                        className="doctor-refresh-button"
                        onClick={loadRecords}
                        disabled={loading}
                        title={t(
                            "medicalRecords.refresh"
                        )}
                    >
                        <FiRefreshCw
                            size={18}
                            className={
                                loading
                                    ? "doctor-spin"
                                    : ""
                            }
                        />
                    </button>

                    <button
                        type="button"
                        className="doctor-primary-button"
                        onClick={
                            handleOpenCreate
                        }
                    >
                        <FiPlus size={18} />

                        <span>
                            {t(
                                "medicalRecords.newRecord"
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            {!loading && !error && (
                <div className="doctor-medical-records-summary">
                    <div className="doctor-medical-records-summary-icon">
                        <FiFileText size={21} />
                    </div>

                    <div>
                        <strong>
                            {records.length}
                        </strong>

                        <span>
                            {t(
                                "medicalRecords.totalRecords"
                            )}
                        </span>
                    </div>
                </div>
            )}

            {/* =========================
                SEARCH
            ========================= */}

            <div className="doctor-medical-records-toolbar">
                <div className="doctor-medical-records-search">
                    <FiSearch size={18} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder={t(
                            "medicalRecords.searchPlaceholder"
                        )}
                    />
                </div>

                {!loading && (
                    <span className="doctor-medical-records-count">
                        {filteredRecords.length}{" "}
                        {filteredRecords.length === 1
                            ? t(
                                  "medicalRecords.record"
                              )
                            : t(
                                  "medicalRecords.records"
                              )}
                    </span>
                )}
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="doctor-medical-records-error">
                    <FiAlertCircle size={20} />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadRecords}
                    >
                        {t(
                            "medicalRecords.tryAgain"
                        )}
                    </button>
                </div>
            )}

            {/* =========================
                LOADING / EMPTY / LIST
            ========================= */}

            {loading ? (
                <div className="doctor-medical-records-state">
                    <div className="doctor-spinner"></div>

                    <p>
                        {t(
                            "medicalRecords.loading"
                        )}
                    </p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="doctor-medical-records-empty">
                    <div className="doctor-medical-records-empty-icon">
                        <FiFileText size={30} />
                    </div>

                    <h2>
                        {search
                            ? t(
                                  "medicalRecords.noRecordsFound"
                              )
                            : t(
                                  "medicalRecords.noRecordsYet"
                              )}
                    </h2>

                    <p>
                        {search
                            ? t(
                                  "medicalRecords.noRecordsFoundDescription"
                              )
                            : t(
                                  "medicalRecords.noRecordsYetDescription"
                              )}
                    </p>

                    {!search && (
                        <button
                            type="button"
                            className="doctor-primary-button"
                            onClick={
                                handleOpenCreate
                            }
                        >
                            <FiPlus size={17} />

                            {t(
                                "medicalRecords.createFirstRecord"
                            )}
                        </button>
                    )}
                </div>
            ) : (
                <div className="doctor-medical-records-grid">

                    {filteredRecords.map(
                        (record) => {
                            const patientName =
                                record.patient?.user
                                    ?.name ||
                                t(
                                    "medicalRecords.unknownPatient"
                                );

                            return (
                                <article
                                    key={record.id}
                                    className="doctor-medical-record-card"
                                >

                                    {/* CARD HEADER */}

                                    <div className="doctor-medical-record-card-header">

                                        <div className="doctor-medical-record-icon">
                                            <FiFileText
                                                size={21}
                                            />
                                        </div>

                                        <div className="doctor-medical-record-title">
                                            <h2>
                                                {
                                                    patientName
                                                }
                                            </h2>

                                            <span>
                                                {t(
                                                    "medicalRecords.recordNumber"
                                                )}{" "}
                                                {
                                                    record.id
                                                }
                                            </span>
                                        </div>

                                        <div className="doctor-medical-record-actions">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenEdit(
                                                        record
                                                    )
                                                }
                                                title={t(
                                                    "medicalRecords.edit"
                                                )}
                                            >
                                                <FiEdit3
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        record
                                                    )
                                                }
                                                title={t(
                                                    "medicalRecords.delete"
                                                )}
                                            >
                                                <FiTrash2
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                        </div>
                                    </div>

                                    {/* APPOINTMENT */}

                                    {(record.appointment ||
                                        record.created_at) && (
                                        <div className="doctor-medical-record-meta">

                                            <div>
                                                <FiCalendar />

                                                <span>
                                                    {record
                                                        .appointment
                                                        ?.appointment_date
                                                        ? formatDate(
                                                              record
                                                                  .appointment
                                                                  .appointment_date
                                                          )
                                                        : formatDate(
                                                              record.created_at
                                                          )}
                                                </span>
                                            </div>

                                            {record
                                                .appointment
                                                ?.appointment_time && (
                                                <div>
                                                    <FiClock />

                                                    <span>
                                                        {formatTime(
                                                            record
                                                                .appointment
                                                                .appointment_time
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                        </div>
                                    )}

                                    {/* DIAGNOSIS */}

                                    <div className="doctor-medical-record-section">
                                        <span className="doctor-medical-record-label">
                                            {t(
                                                "medicalRecords.diagnosis"
                                            )}
                                        </span>

                                        <p>
                                            {record.diagnosis ||
                                                t(
                                                    "medicalRecords.noDiagnosis"
                                                )}
                                        </p>
                                    </div>

                                    {/* TREATMENT */}

                                    <div className="doctor-medical-record-section">
                                        <span className="doctor-medical-record-label">
                                            {t(
                                                "medicalRecords.treatment"
                                            )}
                                        </span>

                                        <p>
                                            {record.treatment ||
                                                t(
                                                    "medicalRecords.noTreatment"
                                                )}
                                        </p>
                                    </div>

                                    {/* NOTES */}

                                    {record.notes && (
                                        <div className="doctor-medical-record-notes">
                                            <span>
                                                {t(
                                                    "medicalRecords.notes"
                                                )}
                                            </span>

                                            <p>
                                                {
                                                    record.notes
                                                }
                                            </p>
                                        </div>
                                    )}

                                </article>
                            );
                        }
                    )}

                </div>
            )}

            {/* =========================
                CREATE / EDIT MODAL
            ========================= */}

            {showForm && (
                <div
                    className="doctor-medical-record-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseForm();
                        }
                    }}
                >
                    <div className="doctor-medical-record-modal">

                        <div className="doctor-medical-record-modal-header">

                            <div>
                                <span>
                                    {editingRecord
                                        ? t(
                                              "medicalRecords.updateRecord"
                                          )
                                        : t(
                                              "medicalRecords.newMedicalRecord"
                                          )}
                                </span>

                                <h2>
                                    {editingRecord
                                        ? t(
                                              "medicalRecords.editMedicalRecord"
                                          )
                                        : t(
                                              "medicalRecords.createMedicalRecord"
                                          )}
                                </h2>
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

                        {loadingFormData ? (
                            <div className="doctor-medical-records-state">
                                <div className="doctor-spinner"></div>

                                <p>
                                    {t(
                                        "medicalRecords.loadingFormData"
                                    )}
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="doctor-medical-record-form"
                            >

                                {formError && (
                                    <div className="doctor-medical-record-form-error">
                                        <FiAlertCircle
                                            size={18}
                                        />

                                        <span>
                                            {
                                                formError
                                            }
                                        </span>
                                    </div>
                                )}

                                {/* PATIENT + APPOINTMENT */}

                                <div className="doctor-medical-record-form-grid">

                                    <div className="doctor-form-group">

                                        <label htmlFor="patient_id">
                                            {t(
                                                "medicalRecords.patient"
                                            )}
                                        </label>

                                        <div className="doctor-medical-record-select-wrapper">

                                            <FiUser
                                                className="doctor-medical-record-select-icon"
                                                size={17}
                                            />

                                            <select
                                                id="patient_id"
                                                name="patient_id"
                                                value={
                                                    form.patient_id
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                disabled={
                                                    !!editingRecord
                                                }
                                            >
                                                <option value="">
                                                    {t(
                                                        "medicalRecords.selectPatient"
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
                                                                    "medicalRecords.patient"
                                                                )} #${patient.id}`}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <FiChevronDown
                                                className="doctor-medical-record-select-arrow"
                                                size={17}
                                            />

                                        </div>
                                    </div>

                                    <div className="doctor-form-group">

                                        <label htmlFor="appointment_id">
                                            {t(
                                                "medicalRecords.appointment"
                                            )}
                                        </label>

                                        <div className="doctor-medical-record-select-wrapper">

                                            <FiCalendar
                                                className="doctor-medical-record-select-icon"
                                                size={17}
                                            />

                                            <select
                                                id="appointment_id"
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
                                                              "medicalRecords.selectPatientFirst"
                                                          )
                                                        : selectedPatientAppointments.length ===
                                                            0
                                                          ? t(
                                                                "medicalRecords.noAppointments"
                                                            )
                                                          : t(
                                                                "medicalRecords.selectAppointment"
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

                                            <FiChevronDown
                                                className="doctor-medical-record-select-arrow"
                                                size={17}
                                            />

                                        </div>
                                    </div>

                                </div>

                                {/* DIAGNOSIS */}

                                <div className="doctor-form-group">

                                    <label htmlFor="diagnosis">
                                        {t(
                                            "medicalRecords.diagnosis"
                                        )}
                                    </label>

                                    <input
                                        id="diagnosis"
                                        type="text"
                                        name="diagnosis"
                                        value={
                                            form.diagnosis
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "medicalRecords.diagnosisPlaceholder"
                                        )}
                                    />

                                </div>

                                {/* TREATMENT */}

                                <div className="doctor-form-group">

                                    <label htmlFor="treatment">
                                        {t(
                                            "medicalRecords.treatment"
                                        )}
                                    </label>

                                    <textarea
                                        id="treatment"
                                        name="treatment"
                                        value={
                                            form.treatment
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "medicalRecords.treatmentPlaceholder"
                                        )}
                                        rows="4"
                                    />

                                </div>

                                {/* NOTES */}

                                <div className="doctor-form-group">

                                    <label htmlFor="notes">
                                        {t(
                                            "medicalRecords.notes"
                                        )}
                                    </label>

                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={
                                            form.notes
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "medicalRecords.notesPlaceholder"
                                        )}
                                        rows="4"
                                    />

                                </div>

                                {/* ACTIONS */}

                                <div className="doctor-medical-record-form-actions">

                                    <button
                                        type="button"
                                        className="doctor-secondary-button"
                                        onClick={
                                            handleCloseForm
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        {t(
                                            "medicalRecords.cancel"
                                        )}
                                    </button>

                                    <button
                                        type="submit"
                                        className="doctor-primary-button"
                                        disabled={
                                            saving ||
                                            !form.patient_id
                                        }
                                    >
                                        {saving
                                            ? t(
                                                  "medicalRecords.saving"
                                              )
                                            : editingRecord
                                              ? t(
                                                    "medicalRecords.updateRecord"
                                                )
                                              : t(
                                                    "medicalRecords.createRecord"
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

export default DoctorMedicalRecords;
