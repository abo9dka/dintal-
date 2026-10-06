import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FiBell,
    FiCalendar,
    FiChevronRight,
    FiClock,
    FiFileText,
    FiRefreshCw,
    FiUser,
    FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function Dashboard() {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const normalizeData = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        return [];
    };

    const loadDashboard = useCallback(
        async (showRefresh = false) => {
            try {
                setError("");

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const [
                    profileResponse,
                    appointmentsResponse,
                    recordsResponse,
                    prescriptionsResponse,
                    notificationsResponse,
                ] = await Promise.all([
                    patientService.getProfile(),
                    patientService.getAppointments(),
                    patientService.getMedicalRecords(),
                    patientService.getPrescriptions(),
                    patientService.getNotifications(),
                ]);

                setProfile(profileResponse || null);

                setAppointments(
                    normalizeData(appointmentsResponse)
                );

                setMedicalRecords(
                    normalizeData(recordsResponse)
                );

                setPrescriptions(
                    normalizeData(prescriptionsResponse)
                );

                setNotifications(
                    normalizeData(notificationsResponse)
                );
            } catch (err) {
                console.error(
                    "Failed to load patient dashboard:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        t("patientDashboard.loadFailed")
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [t]
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    /* =========================================================
       HELPERS
    ========================================================= */

    const getPatientName = () => {
        return (
            profile?.name ||
            profile?.user?.name ||
            profile?.data?.name ||
            t("patientDashboard.patient")
        );
    };

    const getDoctorName = (appointment) => {
        return (
            appointment?.doctor?.name ||
            appointment?.doctor?.user?.name ||
            appointment?.doctor_name ||
            t("patientDashboard.doctor")
        );
    };

    const getDoctorSpecialization = (appointment) => {
        return (
            appointment?.doctor?.specialization ||
            appointment?.doctor?.specialty ||
            appointment?.specialization ||
            t("patientDashboard.dentalSpecialist")
        );
    };

    const getAppointmentDate = (appointment) => {
        return (
            appointment?.appointment_date ||
            appointment?.date ||
            null
        );
    };

    const getAppointmentTime = (appointment) => {
        return (
            appointment?.appointment_time ||
            appointment?.time ||
            null
        );
    };

    const getAppointmentStatus = (appointment) => {
        return (
            appointment?.status ||
            "pending"
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
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
            return "";
        }

        const parts = String(time).split(":");

        if (parts.length < 2) {
            return time;
        }

        const date = new Date();

        date.setHours(
            Number(parts[0]),
            Number(parts[1]),
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

    const isFutureAppointment = (appointment) => {
        const date = getAppointmentDate(appointment);

        if (!date) {
            return false;
        }

        const time =
            getAppointmentTime(appointment) || "00:00";

        const appointmentDate = new Date(
            `${date}T${time}`
        );

        if (Number.isNaN(appointmentDate.getTime())) {
            return false;
        }

        return appointmentDate >= new Date();
    };

    /* =========================================================
       NEXT APPOINTMENT
    ========================================================= */

    const nextAppointment = useMemo(() => {
        const activeAppointments =
            appointments.filter((appointment) => {
                const status =
                    getAppointmentStatus(
                        appointment
                    ).toLowerCase();

                return (
                    status !== "cancelled" &&
                    status !== "completed" &&
                    isFutureAppointment(
                        appointment
                    )
                );
            });

        return [...activeAppointments].sort(
            (a, b) => {
                const aDate = new Date(
                    `${getAppointmentDate(a)}T${
                        getAppointmentTime(a) ||
                        "00:00"
                    }`
                );

                const bDate = new Date(
                    `${getAppointmentDate(b)}T${
                        getAppointmentTime(b) ||
                        "00:00"
                    }`
                );

                return aDate - bDate;
            }
        )[0] || null;
    }, [appointments]);

    /* =========================================================
       RECENT NOTIFICATIONS
    ========================================================= */

    const recentNotifications = useMemo(() => {
        return [...notifications]
            .sort((a, b) => {
                return (
                    new Date(
                        b.created_at || 0
                    ) -
                    new Date(
                        a.created_at || 0
                    )
                );
            })
            .slice(0, 3);
    }, [notifications]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>

                    <p>
                        {t(
                            "patientDashboard.loading"
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="dashboard-welcome">
                <div>
                    <h2>
                        {t(
                            "patientDashboard.welcome"
                        )}{" "}
                        {getPatientName()} 👋
                    </h2>

                    <p>
                        {t(
                            "patientDashboard.welcomeDescription"
                        )}
                    </p>
                </div>

                <div className="welcome-icon">
                    <FiUser />
                </div>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="dashboard-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard()
                        }
                    >
                        {t(
                            "patientDashboard.tryAgain"
                        )}
                    </button>
                </div>
            )}

            {/* =================================================
                DASHBOARD GRID
            ================================================= */}

            <div className="dashboard-grid">
                {/* NEXT APPOINTMENT */}

                <div className="dashboard-card appointment-card">
                    <div className="card-header">
                        <div>
                            <span className="card-label">
                                {t(
                                    "patientDashboard.upcoming"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "patientDashboard.nextAppointment"
                                )}
                            </h3>
                        </div>

                        <div className="card-icon">
                            <FiCalendar />
                        </div>
                    </div>

                    {nextAppointment ? (
                        <>
                            <div className="appointment-info">
                                <h4>
                                    {getDoctorName(
                                        nextAppointment
                                    )}
                                </h4>

                                <p>
                                    {getDoctorSpecialization(
                                        nextAppointment
                                    )}
                                </p>

                                <div className="appointment-details">
                                    <div>
                                        <span>
                                            {t(
                                                "patientDashboard.date"
                                            )}
                                        </span>

                                        <strong>
                                            {formatDate(
                                                getAppointmentDate(
                                                    nextAppointment
                                                )
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            {t(
                                                "patientDashboard.time"
                                            )}
                                        </span>

                                        <strong>
                                            {formatTime(
                                                getAppointmentTime(
                                                    nextAppointment
                                                )
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            {t(
                                                "patientDashboard.status"
                                            )}
                                        </span>

                                        <strong>
                                            {t(
                                                `patientDashboard.statuses.${getAppointmentStatus(
                                                    nextAppointment
                                                ).toLowerCase()}`
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/patient/appointments/${nextAppointment.id}`
                                    )
                                }
                            >
                                {t(
                                    "patientDashboard.viewAppointment"
                                )}

                                <FiChevronRight />
                            </button>
                        </>
                    ) : (
                        <div className="dashboard-no-data">
                            <FiCalendar />

                            <p>
                                {t(
                                    "patientDashboard.noUpcomingAppointment"
                                )}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/appointments"
                                    )
                                }
                            >
                                {t(
                                    "patientDashboard.bookAppointment"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* DENTAL CARE SUMMARY */}

                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <span className="card-label">
                                {t(
                                    "patientDashboard.overview"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "patientDashboard.dentalCare"
                                )}
                            </h3>
                        </div>

                        <div className="card-icon">
                            🦷
                        </div>
                    </div>

                    <div className="dashboard-stat-grid">
                        <div className="dashboard-stat">
                            <FiCalendar />

                            <strong>
                                {appointments.length}
                            </strong>

                            <span>
                                {t(
                                    "patientDashboard.appointments"
                                )}
                            </span>
                        </div>

                        <div className="dashboard-stat">
                            <FiFileText />

                            <strong>
                                {medicalRecords.length}
                            </strong>

                            <span>
                                {t(
                                    "patientDashboard.medicalRecords"
                                )}
                            </span>
                        </div>

                        <div className="dashboard-stat">
                            💊

                            <strong>
                                {prescriptions.length}
                            </strong>

                            <span>
                                {t(
                                    "patientDashboard.prescriptions"
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="section-title">
                <h3>
                    {t(
                        "patientDashboard.quickActions"
                    )}
                </h3>
            </div>

            <div className="quick-actions">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/patient/doctors")
                    }
                >
                    <span>
                        <FiUsers />
                    </span>

                    <strong>
                        {t(
                            "patientDashboard.findDoctor"
                        )}
                    </strong>

                    <small>
                        {t(
                            "patientDashboard.findDoctorDescription"
                        )}
                    </small>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/patient/appointments"
                        )
                    }
                >
                    <span>
                        <FiCalendar />
                    </span>

                    <strong>
                        {t(
                            "patientDashboard.bookAppointment"
                        )}
                    </strong>

                    <small>
                        {t(
                            "patientDashboard.bookAppointmentDescription"
                        )}
                    </small>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/patient/medical-records"
                        )
                    }
                >
                    <span>
                        <FiFileText />
                    </span>

                    <strong>
                        {t(
                            "patientDashboard.medicalRecords"
                        )}
                    </strong>

                    <small>
                        {t(
                            "patientDashboard.medicalRecordsDescription"
                        )}
                    </small>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/patient/dental-health"
                        )
                    }
                >
                    <span>🦷</span>

                    <strong>
                        {t(
                            "patientDashboard.dentalHealth"
                        )}
                    </strong>

                    <small>
                        {t(
                            "patientDashboard.dentalHealthDescription"
                        )}
                    </small>
                </button>
            </div>

            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="section-title dashboard-section-header">
                <h3>
                    {t(
                        "patientDashboard.recentActivity"
                    )}
                </h3>

                <button
                    type="button"
                    className="dashboard-refresh-button"
                    onClick={() =>
                        loadDashboard(true)
                    }
                    disabled={refreshing}
                >
                    <FiRefreshCw
                        className={
                            refreshing
                                ? "dashboard-refresh-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? t(
                              "patientDashboard.refreshing"
                          )
                        : t(
                              "patientDashboard.refresh"
                          )}
                </button>
            </div>

            <div className="activity-card">
                {recentNotifications.length > 0 ? (
                    recentNotifications.map(
                        (notification) => (
                            <div
                                className="activity-item"
                                key={
                                    notification.id
                                }
                            >
                                <span>
                                    <FiBell />
                                </span>

                                <div>
                                    <strong>
                                        {notification.title ||
                                            t(
                                                "patientDashboard.notification"
                                            )}
                                    </strong>

                                    <p>
                                        {notification.message ||
                                            t(
                                                "patientDashboard.newNotification"
                                            )}
                                    </p>
                                </div>

                                <small>
                                    {formatDate(
                                        notification.created_at
                                    )}
                                </small>
                            </div>
                        )
                    )
                ) : (
                    <div className="dashboard-empty-activity">
                        <FiBell />

                        <p>
                            {t(
                                "patientDashboard.noRecentActivity"
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
