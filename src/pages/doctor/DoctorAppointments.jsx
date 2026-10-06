import { useEffect, useState } from "react";

import {
    FiCalendar,
    FiClock,
    FiActivity,
    FiPhone,
    FiCheck,
    FiX,
    FiCheckCircle,
    FiRefreshCw,
    FiAlertCircle,
    FiFilter,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorAppointments() {
    const { t, language } = useLanguage();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (statusFilter) {
                params.status = statusFilter;
            }

            if (dateFilter) {
                params.date = dateFilter;
            }

            params.per_page = 50;

            const response =
                await doctorService.getAppointments(params);

            const data = response?.data;

            if (Array.isArray(data)) {
                setAppointments(data);
            } else if (Array.isArray(data?.data)) {
                setAppointments(data.data);
            } else {
                setAppointments([]);
            }
        } catch (err) {
            console.error(
                "Doctor appointments error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("appointments.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [statusFilter, dateFilter]);

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);

            await doctorService.updateAppointmentStatus(
                id,
                status
            );

            await loadAppointments();
        } catch (err) {
            console.error(
                "Update appointment status error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("appointments.updateFailed")
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: t("appointments.pending"),
            confirmed: t("appointments.confirmed"),
            completed: t("appointments.completed"),
            cancelled: t("appointments.cancelled"),
        };

        return labels[status] || status;
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            language === "ar" ? "ar-SA" : "en-US",
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

        const [hours, minutes] = time.split(":");

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            language === "ar" ? "ar-SA" : "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    const formatType = (type) => {
        if (!type) {
            return "-";
        }

        const typeLabels = {
            consultation: t(
                "appointments.types.consultation"
            ),

            cleaning: t(
                "appointments.types.cleaning"
            ),

            orthodontics: t(
                "appointments.types.orthodontics"
            ),

            whitening: t(
                "appointments.types.whitening"
            ),

            treatment: t(
                "appointments.types.treatment"
            ),
        };

        return (
            typeLabels[type] ||
            type
                .replace(/_/g, " ")
                .replace(
                    /\b\w/g,
                    (letter) =>
                        letter.toUpperCase()
                )
        );
    };

    const clearFilters = () => {
        setStatusFilter("");
        setDateFilter("");
    };

    return (
        <div className="doctor-appointments-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="doctor-page-header">

                <div>

                    <span className="doctor-page-eyebrow">
                        {t(
                            "appointments.eyebrow"
                        )}
                    </span>

                    <h1>
                        {t(
                            "appointments.title"
                        )}
                    </h1>

                    <p>
                        {t(
                            "appointments.description"
                        )}
                    </p>

                </div>

                <button
                    type="button"
                    className="doctor-refresh-button"
                    onClick={loadAppointments}
                    disabled={loading}
                    title={t(
                        "appointments.refresh"
                    )}
                    aria-label={t(
                        "appointments.refresh"
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

            </div>


            {/* =========================
                FILTERS
            ========================= */}

            <div className="doctor-appointments-filters">

                <div className="doctor-filter-title">

                    <FiFilter size={18} />

                    <span>
                        {t(
                            "appointments.filters"
                        )}
                    </span>

                </div>


                <div className="doctor-filter-group">

                    <label htmlFor="appointment-status">
                        {t(
                            "appointments.status"
                        )}
                    </label>

                    <select
                        id="appointment-status"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            {t(
                                "appointments.allStatuses"
                            )}
                        </option>

                        <option value="pending">
                            {t(
                                "appointments.pending"
                            )}
                        </option>

                        <option value="confirmed">
                            {t(
                                "appointments.confirmed"
                            )}
                        </option>

                        <option value="completed">
                            {t(
                                "appointments.completed"
                            )}
                        </option>

                        <option value="cancelled">
                            {t(
                                "appointments.cancelled"
                            )}
                        </option>
                    </select>

                </div>


                <div className="doctor-filter-group">

                    <label htmlFor="appointment-date">
                        {t(
                            "appointments.date"
                        )}
                    </label>

                    <input
                        id="appointment-date"
                        type="date"
                        value={dateFilter}
                        onChange={(event) =>
                            setDateFilter(
                                event.target.value
                            )
                        }
                    />

                </div>


                {(statusFilter || dateFilter) && (
                    <button
                        type="button"
                        className="doctor-clear-filter"
                        onClick={clearFilters}
                    >
                        {t(
                            "appointments.clearFilters"
                        )}
                    </button>
                )}

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="doctor-appointments-error">

                    <FiAlertCircle size={20} />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadAppointments}
                    >
                        {t(
                            "appointments.tryAgain"
                        )}
                    </button>

                </div>
            )}


            {/* =========================
                LOADING / EMPTY / DATA
            ========================= */}

            {loading ? (

                <div className="doctor-appointments-state">

                    <div className="doctor-spinner"></div>

                    <p>
                        {t(
                            "appointments.loading"
                        )}
                    </p>

                </div>

            ) : appointments.length === 0 ? (

                /* =========================
                    EMPTY
                ========================= */

                <div className="doctor-appointments-empty">

                    <div className="doctor-empty-icon">
                        <FiCalendar size={30} />
                    </div>

                    <h2>
                        {t(
                            "appointments.emptyTitle"
                        )}
                    </h2>

                    <p>
                        {t(
                            "appointments.emptyDescription"
                        )}
                    </p>

                    {(statusFilter || dateFilter) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            {t(
                                "appointments.clearFilters"
                            )}
                        </button>
                    )}

                </div>

            ) : (

                /* =========================
                    APPOINTMENTS
                ========================= */

                <div className="doctor-appointments-list">

                    {appointments.map(
                        (appointment) => {

                            const patientName =
                                appointment.patient
                                    ?.user?.name ||
                                t(
                                    "appointments.unknownPatient"
                                );

                            const patientPhone =
                                appointment.patient
                                    ?.phone || "-";

                            const isUpdating =
                                updatingId ===
                                appointment.id;

                            return (
                                <article
                                    key={
                                        appointment.id
                                    }
                                    className="doctor-appointment-card"
                                >

                                    {/* TOP */}

                                    <div className="doctor-appointment-top">

                                        <div className="doctor-patient-info">

                                            <div className="doctor-patient-avatar">
                                                {patientName
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <h2>
                                                    {
                                                        patientName
                                                    }
                                                </h2>

                                                <div className="doctor-patient-phone">

                                                    <FiPhone
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            patientPhone
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <span
                                            className={`doctor-status doctor-status-${appointment.status}`}
                                        >
                                            {getStatusLabel(
                                                appointment.status
                                            )}
                                        </span>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="doctor-appointment-details">

                                        <div className="doctor-appointment-detail">

                                            <FiCalendar />

                                            <div>

                                                <span>
                                                    {t(
                                                        "appointments.date"
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        appointment.appointment_date
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="doctor-appointment-detail">

                                            <FiClock />

                                            <div>

                                                <span>
                                                    {t(
                                                        "appointments.time"
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatTime(
                                                        appointment.appointment_time
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="doctor-appointment-detail">

                                            <FiActivity />

                                            <div>

                                                <span>
                                                    {t(
                                                        "appointments.type"
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatType(
                                                        appointment.type
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="doctor-appointment-detail">

                                            <FiClock />

                                            <div>

                                                <span>
                                                    {t(
                                                        "appointments.duration"
                                                    )}
                                                </span>

                                                <strong>
                                                    {appointment.duration
                                                        ? `${appointment.duration} ${t(
                                                              "appointments.minutes"
                                                          )}`
                                                        : "-"}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* REASON */}

                                    {appointment.reason && (
                                        <div className="doctor-appointment-reason">

                                            <span>
                                                {t(
                                                    "appointments.reason"
                                                )}
                                            </span>

                                            <p>
                                                {
                                                    appointment.reason
                                                }
                                            </p>

                                        </div>
                                    )}


                                    {/* ACTIONS */}

                                    {appointment.status !==
                                        "cancelled" &&
                                        appointment.status !==
                                            "completed" && (

                                            <div className="doctor-appointment-actions">

                                                {appointment.status ===
                                                    "pending" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="doctor-action-confirm"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    appointment.id,
                                                                    "confirmed"
                                                                )
                                                            }
                                                        >
                                                            <FiCheck
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            {t(
                                                                "appointments.confirm"
                                                            )}
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="doctor-action-cancel"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    appointment.id,
                                                                    "cancelled"
                                                                )
                                                            }
                                                        >
                                                            <FiX
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            {t(
                                                                "appointments.cancel"
                                                            )}
                                                        </button>
                                                    </>
                                                )}


                                                {appointment.status ===
                                                    "confirmed" && (
                                                    <button
                                                        type="button"
                                                        className="doctor-action-complete"
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                "completed"
                                                            )
                                                        }
                                                    >
                                                        <FiCheckCircle
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        {t(
                                                            "appointments.markCompleted"
                                                        )}
                                                    </button>
                                                )}

                                            </div>
                                        )}

                                </article>
                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
}

export default DoctorAppointments;
