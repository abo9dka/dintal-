import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiPlus,
    FiUser,
    FiMoreVertical,
    FiX,
    FiCheckCircle,
} from "react-icons/fi";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function Appointments() {
    const navigate = useNavigate();

    const { t, language } = useLanguage();

    const [appointments, setAppointments] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [selectedAppointment, setSelectedAppointment] =
        useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await patientService.getAppointments();

            const appointmentsData =
                Array.isArray(data)
                    ? data
                    : data?.appointments || [];

            setAppointments(appointmentsData);
        } catch (error) {
            console.error(
                "Failed to load appointments:",
                error
            );

            setError(
                language === "ar"
                    ? "تعذر تحميل مواعيدك. يرجى المحاولة مرة أخرى."
                    : "Unable to load your appointments. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const normalizeAppointment = (appointment) => {
        const doctorName =
            appointment?.doctor?.user?.name ||
            appointment?.doctor?.name ||
            appointment?.doctor_name ||
            "Unknown Doctor";

        const specialty =
            appointment?.doctor?.specialization ||
            appointment?.specialization ||
            appointment?.specialty ||
            "Dental Care";

        const clinic =
            appointment?.doctor?.clinic_address ||
            appointment?.clinic_address ||
            appointment?.clinic ||
            "Dental Clinic";

        const date =
            appointment?.appointment_date ||
            appointment?.date ||
            null;

        const time =
            appointment?.appointment_time ||
            appointment?.time ||
            "--:--";

        // Normalize Laravel date
        let datePart = null;

        if (date) {
            datePart = String(date).slice(0, 10);
        }

        // Format date without timezone problems
        let formattedDate =
            language === "ar"
                ? "تاريخ غير معروف"
                : "Unknown Date";

        if (datePart) {
            const [year, month, day] =
                datePart.split("-").map(Number);

            const localDate = new Date(
                year,
                month - 1,
                day
            );

            formattedDate =
                localDate.toLocaleDateString(
                    language === "ar"
                        ? "ar"
                        : "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }
                );
        }

        // Format time
        let formattedTime = time;

        if (
            time &&
            time !== "--:--"
        ) {
            const [hours, minutes] =
                String(time).split(":");

            if (
                hours !== undefined &&
                minutes !== undefined
            ) {
                const timeDate = new Date();

                timeDate.setHours(
                    Number(hours),
                    Number(minutes),
                    0,
                    0
                );

                formattedTime =
                    timeDate.toLocaleTimeString(
                        language === "ar"
                            ? "ar"
                            : "en-US",
                        {
                            hour: "numeric",
                            minute: "2-digit",
                        }
                    );
            }
        }

        // Appointment DateTime
        let appointmentDateTime = null;

        if (
            datePart &&
            time &&
            time !== "--:--"
        ) {
            const [
                year,
                month,
                day,
            ] = datePart
                .split("-")
                .map(Number);

            const [
                hours,
                minutes,
            ] = String(time)
                .split(":")
                .map(Number);

            appointmentDateTime =
                new Date(
                    year,
                    month - 1,
                    day,
                    hours,
                    minutes,
                    0,
                    0
                );
        }

        return {
            ...appointment,
            doctor: doctorName,
            specialty,
            clinic,
            date: formattedDate,
            time: formattedTime,
            rawDate: datePart,
            rawTime: time,
            appointmentDateTime,
        };
    };

    const normalizedAppointments = useMemo(() => {
        return appointments
            .map(normalizeAppointment)
            .sort((a, b) => {
                const dateA =
                    a.appointmentDateTime?.getTime() ||
                    0;

                const dateB =
                    b.appointmentDateTime?.getTime() ||
                    0;

                return dateA - dateB;
            });
    }, [appointments, language]);

    const now = new Date();

    const upcomingAppointments =
        normalizedAppointments.filter(
            (appointment) => {
                const appointmentDate =
                    appointment.appointmentDateTime;

                const status =
                    appointment.status?.toLowerCase();

                if (
                    [
                        "completed",
                        "cancelled",
                    ].includes(status)
                ) {
                    return false;
                }

                if (!appointmentDate) {
                    return false;
                }

                return appointmentDate >= now;
            }
        );

    const previousAppointments =
        normalizedAppointments
            .filter((appointment) => {
                const appointmentDate =
                    appointment.appointmentDateTime;

                const status =
                    appointment.status?.toLowerCase();

                if (
                    [
                        "completed",
                        "cancelled",
                    ].includes(status)
                ) {
                    return true;
                }

                if (!appointmentDate) {
                    return false;
                }

                return appointmentDate < now;
            })
            .sort((a, b) => {
                const dateA =
                    a.appointmentDateTime?.getTime() ||
                    0;

                const dateB =
                    b.appointmentDateTime?.getTime() ||
                    0;

                return dateB - dateA;
            });

    const handleCancel = async (id) => {
        const appointment =
            appointments.find(
                (item) => item.id === id
            );

        if (!appointment) {
            return;
        }

        const status =
            appointment.status?.toLowerCase();

        if (
            [
                "completed",
                "cancelled",
            ].includes(status)
        ) {
            return;
        }

        const confirmed = window.confirm(
            language === "ar"
                ? "هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟"
                : "Are you sure you want to cancel this appointment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(id);
            setError("");

            await patientService.cancelAppointment(
                id
            );

            setOpenMenu(null);
            setSelectedAppointment(null);

            await loadAppointments();
        } catch (error) {
            console.error(
                "Failed to cancel appointment:",
                error
            );

            const message =
                error.response?.data?.message ||
                (language === "ar"
                    ? "تعذر إلغاء الموعد. يرجى المحاولة مرة أخرى."
                    : "Unable to cancel the appointment. Please try again.");

            setError(message);
        } finally {
            setCancellingId(null);
        }
    };

    const handleViewDetails = (
        appointment
    ) => {
        setOpenMenu(null);
        setSelectedAppointment(
            appointment
        );
    };

    const getStatusLabel = (status) => {
        const normalizedStatus =
            status?.toLowerCase() ||
            "pending";

        const statusTranslations = {
            pending:
                "patientAppointments.pending",

            confirmed:
                "patientAppointments.confirmed",

            completed:
                "patientAppointments.completed",

            cancelled:
                "patientAppointments.cancelled",
        };

        const translationKey =
            statusTranslations[
                normalizedStatus
            ];

        return translationKey
            ? t(translationKey)
            : status;
    };

    const getTypeLabel = (type) => {
        if (!type) {
            return language === "ar"
                ? "موعد أسنان"
                : "Dental Appointment";
        }

        return type
            .replace(/\_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const canCancel = (appointment) => {
        const status =
            appointment?.status?.toLowerCase();

        return ![
            "completed",
            "cancelled",
        ].includes(status);
    };

    return (
        <div className="appointments-page">
            {/* PAGE HEADER */}
            <div className="page-heading">
                <div>
                    <h2>
                        {t(
                            "patientAppointments.title"
                        )}
                    </h2>

                    <p>
                        {t(
                            "patientAppointments.description"
                        )}
                    </p>
                </div>

                <button
                    className="primary-action"
                    type="button"
                    onClick={() =>
                        navigate(
                            "/patient/appointments/book"
                        )
                    }
                >
                    <FiPlus />

                    {t(
                        "patientAppointments.bookAppointment"
                    )}
                </button>
            </div>

            {/* ERROR */}
            {!loading && error && (
                <div className="empty-appointments">
                    <div className="empty-icon">
                        <FiCalendar />
                    </div>

                    <h3>
                        {language === "ar"
                            ? "تعذر تحميل المواعيد"
                            : "Unable to load appointments"}
                    </h3>

                    <p>{error}</p>

                    <button
                        className="primary-action"
                        type="button"
                        onClick={
                            loadAppointments
                        }
                    >
                        {language === "ar"
                            ? "حاول مرة أخرى"
                            : "Try Again"}
                    </button>
                </div>
            )}

            {/* UPCOMING */}
            {!error && (
                <section className="appointments-section">
                    <h3 className="section-title">
                        {t(
                            "patientAppointments.upcoming"
                        )}
                    </h3>

                    {loading ? (
                        <div className="upcoming-appointment empty-appointments">
                            <div className="empty-icon">
                                <FiCalendar />
                            </div>

                            <h3>
                                {t(
                                    "patientAppointments.loading"
                                )}
                            </h3>

                            <p>
                                {language ===
                                "ar"
                                    ? "يرجى الانتظار بينما نقوم بتحميل مواعيدك."
                                    : "Please wait while we load your appointments."}
                            </p>
                        </div>
                    ) : upcomingAppointments.length ===
                      0 ? (
                        <div className="upcoming-appointment empty-appointments">
                            <div className="empty-icon">
                                <FiCalendar />
                            </div>

                            <h3>
                                {t(
                                    "patientAppointments.noUpcoming"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "patientAppointments.noUpcomingDescription"
                                )}
                            </p>

                            <button
                                className="primary-action"
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/appointments/book"
                                    )
                                }
                            >
                                <FiPlus />

                                {t(
                                    "patientAppointments.bookAppointment"
                                )}
                            </button>
                        </div>
                    ) : (
                        upcomingAppointments.map(
                            (appointment) => (
                                <div
                                    className="upcoming-appointment"
                                    key={
                                        appointment.id
                                    }
                                >
                                    {/* CARD HEADER */}
                                    <div className="upcoming-header">
                                        <h3>
                                            {t(
                                                "patientAppointments.upcomingAppointment"
                                            )}
                                        </h3>

                                        <span className="appointment-status">
                                            {getStatusLabel(
                                                appointment.status
                                            )}
                                        </span>
                                    </div>

                                    {/* CARD CONTENT */}
                                    <div className="appointment-content">
                                        <div className="doctor-avatar">
                                            <FiUser />
                                        </div>

                                        <div className="appointment-info">
                                            <h3>
                                                {
                                                    appointment.doctor
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    appointment.specialty
                                                }
                                            </p>

                                            <div className="appointment-details">
                                                <div className="appointment-detail">
                                                    <FiCalendar />

                                                    <span>
                                                        {
                                                            appointment.date
                                                        }
                                                    </span>
                                                </div>

                                                <div className="appointment-detail">
                                                    <FiClock />

                                                    <span>
                                                        {
                                                            appointment.time
                                                        }
                                                    </span>
                                                </div>

                                                <div className="appointment-detail">
                                                    <FiMapPin />

                                                    <span>
                                                        {
                                                            appointment.clinic
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="appointment-actions">
                                            <button
                                                className="secondary-action"
                                                type="button"
                                                onClick={() =>
                                                    handleViewDetails(
                                                        appointment
                                                    )
                                                }
                                            >
                                                {t(
                                                    "patientAppointments.viewDetails"
                                                )}
                                            </button>

                                            <div className="more-wrapper">
                                                <button
                                                    className="more-button"
                                                    type="button"
                                                    aria-label={t(
                                                        "patientAppointments.actions"
                                                    )}
                                                    onClick={() =>
                                                        setOpenMenu(
                                                            openMenu ===
                                                                appointment.id
                                                                ? null
                                                                : appointment.id
                                                        )
                                                    }
                                                >
                                                    <FiMoreVertical />
                                                </button>

                                                {openMenu ===
                                                    appointment.id && (
                                                    <div className="appointment-menu">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    appointment
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                "patientAppointments.viewDetails"
                                                            )}
                                                        </button>

                                                        {canCancel(
                                                            appointment
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                className="cancel-option"
                                                                disabled={
                                                                    cancellingId ===
                                                                    appointment.id
                                                                }
                                                                onClick={() =>
                                                                    handleCancel(
                                                                        appointment.id
                                                                    )
                                                                }
                                                            >
                                                                <FiX />

                                                                {cancellingId ===
                                                                appointment.id
                                                                    ? t(
                                                                          "patientAppointments.cancelling"
                                                                      )
                                                                    : t(
                                                                          "patientAppointments.cancelAppointment"
                                                                      )}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    )}
                </section>
            )}

            {/* PREVIOUS */}
            {!loading &&
                !error &&
                previousAppointments.length > 0 && (
                    <section className="previous-section">
                        <h3 className="section-title">
                            {t(
                                "patientAppointments.previous"
                            )}
                        </h3>

                        {previousAppointments.map(
                            (appointment) => (
                                <div
                                    className="previous-appointment"
                                    key={
                                        appointment.id
                                    }
                                >
                                    <div className="doctor-avatar">
                                        <FiUser />
                                    </div>

                                    <div className="previous-info">
                                        <h3>
                                            {
                                                appointment.doctor
                                            }
                                        </h3>

                                        <p>
                                            {
                                                appointment.specialty
                                            }
                                        </p>
                                    </div>

                                    <div className="previous-date">
                                        <span>
                                            {
                                                appointment.date
                                            }
                                        </span>

                                        <small>
                                            {
                                                appointment.time
                                            }
                                        </small>
                                    </div>

                                    <span
                                        className={`appointment-status ${
                                            appointment.status?.toLowerCase() ===
                                            "completed"
                                                ? "completed"
                                                : appointment.status?.toLowerCase() ===
                                                    "cancelled"
                                                  ? "cancelled"
                                                  : ""
                                        }`}
                                    >
                                        {getStatusLabel(
                                            appointment.status
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </section>
                )}

            {/* DETAILS MODAL */}
            {selectedAppointment && (
                <div
                    className="appointment-modal-overlay"
                    onClick={() =>
                        setSelectedAppointment(
                            null
                        )
                    }
                >
                    <div
                        className="appointment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* MODAL HEADER */}
                        <div className="appointment-modal-header">
                            <div>
                                <span className="modal-label">
                                    {language ===
                                    "ar"
                                        ? "تفاصيل الموعد"
                                        : "APPOINTMENT DETAILS"}
                                </span>

                                <h3>
                                    {t(
                                        "patientAppointments.details"
                                    )}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                aria-label={t(
                                    "patientAppointments.close"
                                )}
                                onClick={() =>
                                    setSelectedAppointment(
                                        null
                                    )
                                }
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* DOCTOR */}
                        <div className="modal-doctor">
                            <div className="modal-doctor-avatar">
                                <FiUser />
                            </div>

                            <div>
                                <strong>
                                    {
                                        selectedAppointment.doctor
                                    }
                                </strong>

                                <span>
                                    {
                                        selectedAppointment.specialty
                                    }
                                </span>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="modal-details">
                            <div className="modal-detail">
                                <div className="modal-detail-icon">
                                    <FiCalendar />
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.date"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            selectedAppointment.date
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="modal-detail">
                                <div className="modal-detail-icon">
                                    <FiClock />
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.time"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            selectedAppointment.time
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="modal-detail">
                                <div className="modal-detail-icon">
                                    <FiMapPin />
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.clinic"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            selectedAppointment.clinic
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="modal-detail">
                                <div className="modal-detail-icon">
                                    <FiCheckCircle />
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.status"
                                        )}
                                    </span>

                                    <strong>
                                        {getStatusLabel(
                                            selectedAppointment.status
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="modal-detail">
                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.type"
                                        )}
                                    </span>

                                    <strong>
                                        {getTypeLabel(
                                            selectedAppointment.type
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* REASON */}
                        {selectedAppointment.reason && (
                            <div className="modal-detail">
                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.reason"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            selectedAppointment.reason
                                        }
                                    </strong>
                                </div>
                            </div>
                        )}

                        {/* NOTES */}
                        {selectedAppointment.notes && (
                            <div className="modal-detail">
                                <div>
                                    <span>
                                        {t(
                                            "patientAppointments.notes"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            selectedAppointment.notes
                                        }
                                    </strong>
                                </div>
                            </div>
                        )}

                        {/* MODAL ACTIONS */}
                        <div className="appointment-modal-actions">
                            <button
                                type="button"
                                className="modal-secondary-button"
                                onClick={() =>
                                    setSelectedAppointment(
                                        null
                                    )
                                }
                            >
                                {t(
                                    "patientAppointments.close"
                                )}
                            </button>

                            {canCancel(
                                selectedAppointment
                            ) && (
                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    disabled={
                                        cancellingId ===
                                        selectedAppointment.id
                                    }
                                    onClick={() =>
                                        handleCancel(
                                            selectedAppointment.id
                                        )
                                    }
                                >
                                    <FiX />

                                    {cancellingId ===
                                    selectedAppointment.id
                                        ? t(
                                              "patientAppointments.cancelling"
                                          )
                                        : t(
                                              "patientAppointments.cancelAppointment"
                                          )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Appointments;
