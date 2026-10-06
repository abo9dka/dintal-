import { useEffect, useMemo, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import {
    FiHome,
    FiCalendar,
    FiFileText,
    FiActivity,
    FiUser,
    FiLogOut,
    FiBell,
    FiChevronDown,
    FiClipboard,
    FiRefreshCw,
    FiSun,
    FiMoon,
    FiGlobe,
    FiMenu,
    FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

import patientService from "../../services/patientService";

function PatientHome() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const { theme, toggleTheme } = useTheme();

    const { language, setLanguage, t } =
        useLanguage();

    const [nextAppointment, setNextAppointment] =
        useState(null);

    const [appointments, setAppointments] =
        useState([]);

    const [medicalRecords, setMedicalRecords] =
        useState([]);

    const [prescriptions, setPrescriptions] =
        useState([]);

    const [
        unreadNotifications,
        setUnreadNotifications,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const closeSidebar = () =>
        setSidebarOpen(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    /* =========================================================
       LOAD DASHBOARD
    ========================================================= */

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                appointmentsData,
                recordsData,
                prescriptionsData,
                notificationsData,
            ] = await Promise.all([
                patientService.getAppointments(),
                patientService.getMedicalRecords(),
                patientService.getPrescriptions(),
                patientService.getUnreadNotifications(),
            ]);

            const appointmentsList =
                Array.isArray(appointmentsData)
                    ? appointmentsData
                    : appointmentsData?.appointments ||
                      appointmentsData?.data ||
                      [];

            const recordsList =
                Array.isArray(recordsData)
                    ? recordsData
                    : recordsData?.records ||
                      recordsData?.medical_records ||
                      recordsData?.data ||
                      [];

            const prescriptionsList =
                Array.isArray(
                    prescriptionsData
                )
                    ? prescriptionsData
                    : prescriptionsData?.prescriptions ||
                      prescriptionsData?.data ||
                      [];

            const notificationsList =
                Array.isArray(
                    notificationsData
                )
                    ? notificationsData
                    : notificationsData?.notifications ||
                      notificationsData?.data ||
                      [];

            setAppointments(
                appointmentsList
            );

            setMedicalRecords(
                recordsList
            );

            setPrescriptions(
                prescriptionsList
            );

            setUnreadNotifications(
                notificationsList
            );

            const now = new Date();

            const upcomingAppointments =
                appointmentsList
                    .filter((appointment) => {
                        if (!appointment) {
                            return false;
                        }

                        if (
                            appointment.status ===
                                "cancelled" ||
                            appointment.status ===
                                "completed"
                        ) {
                            return false;
                        }

                        const appointmentDate =
                            getAppointmentDateTime(
                                appointment
                            );

                        return (
                            appointmentDate &&
                            appointmentDate >= now
                        );
                    })
                    .sort((a, b) => {
                        const dateA =
                            getAppointmentDateTime(
                                a
                            )?.getTime() ||
                            Infinity;

                        const dateB =
                            getAppointmentDateTime(
                                b
                            )?.getTime() ||
                            Infinity;

                        return dateA - dateB;
                    });

            setNextAppointment(
                upcomingAppointments[0] || null
            );
        } catch (error) {
            console.error(
                "Failed to load dashboard:",
                error
            );

            setError(
                t(
                    "patientHome.dashboardLoadFailed"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = async () => {
        await logout();

        navigate("/login");
    };

    /* =========================================================
       APPOINTMENT HELPERS
    ========================================================= */

    const getDoctorName = (
        appointment
    ) => {
        return (
            appointment?.doctor?.user?.name ||
            appointment?.doctor?.name ||
            appointment?.doctor_name ||
            t("patientHome.doctor")
        );
    };

    const getDoctorSpecialization = (
        appointment
    ) => {
        return (
            appointment?.doctor
                ?.specialization ||
            appointment?.specialization ||
            ""
        );
    };

    const getAppointmentDateTime = (
        appointment
    ) => {
        if (
            !appointment?.appointment_date
        ) {
            return null;
        }

        const date =
            appointment.appointment_date;

        const time =
            appointment.appointment_time ||
            "00:00";

        const parsedDate = new Date(
            `${date}T${time}`
        );

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return null;
        }

        return parsedDate;
    };

    /* =========================================================
       DATE HELPERS
    ========================================================= */

    const getRecordDate = (record) => {
        return (
            record?.created_at ||
            record?.updated_at ||
            record?.date ||
            record?.appointment
                ?.appointment_date ||
            null
        );
    };

    const getPrescriptionDate = (
        prescription
    ) => {
        return (
            prescription?.created_at ||
            prescription?.updated_at ||
            prescription?.appointment
                ?.date ||
            prescription?.appointment
                ?.appointment_date ||
            null
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "--";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const formatTime = (time) => {
        if (!time) {
            return "--";
        }

        const [
            hours,
            minutes,
        ] = time.split(":");

        if (
            hours === undefined ||
            minutes === undefined
        ) {
            return time;
        }

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    /* =========================================================
       FORMAT TYPE
    ========================================================= */

    const formatType = (type) => {
        if (!type) {
            return t(
                "patientHome.appointment"
            );
        }

        return String(type)
            .replace(/\_/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    /* =========================================================
       FORMAT STATUS
    ========================================================= */

    const formatStatus = (status) => {
        if (!status) {
            return t(
                "patientHome.updated"
            );
        }

        const normalized =
            String(status)
                .toLowerCase();

        const translatedStatus = t(
            `patientHome.statuses.${normalized}`
        );

        if (
            translatedStatus &&
            !translatedStatus.includes(
                "patientHome.statuses."
            )
        ) {
            return translatedStatus;
        }

        return String(status)
            .replace(/\_/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    /* =========================================================
       RELATIVE DATE
    ========================================================= */

    const formatRelativeDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        const now = new Date();

        const difference =
            now.getTime() -
            parsedDate.getTime();

        const seconds = Math.floor(
            difference / 1000
        );

        if (seconds < 0) {
            return t(
                "patientHome.upcoming"
            );
        }

        const minutes = Math.floor(
            seconds / 60
        );

        const hours = Math.floor(
            minutes / 60
        );

        const days = Math.floor(
            hours / 24
        );

        if (seconds < 60) {
            return t(
                "patientHome.justNow"
            );
        }

        if (minutes < 60) {
            return `${minutes} ${
                minutes === 1
                    ? t(
                          "patientHome.minute"
                      )
                    : t(
                          "patientHome.minutes"
                      )
            } ${t(
                "patientHome.ago"
            )}`;
        }

        if (hours < 24) {
            return `${hours} ${
                hours === 1
                    ? t(
                          "patientHome.hour"
                      )
                    : t(
                          "patientHome.hours"
                      )
            } ${t(
                "patientHome.ago"
            )}`;
        }

        if (days < 7) {
            return `${days} ${
                days === 1
                    ? t(
                          "patientHome.day"
                      )
                    : t(
                          "patientHome.days"
                      )
            } ${t(
                "patientHome.ago"
            )}`;
        }

        return parsedDate.toLocaleDateString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    /* =========================================================
       GREETING
    ========================================================= */

    const getGreeting = () => {
        const hour =
            new Date().getHours();

        if (language === "ar") {
            if (hour < 12) {
                return "صباح الخير";
            }

            if (hour < 18) {
                return "مساء الخير";
            }

            return "مساء الخير";
        }

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 18) {
            return "Good afternoon";
        }

        return "Good evening";
    };

    /* =========================================================
       SORTED DATA
    ========================================================= */

    const sortedRecords = useMemo(() => {
        return [...medicalRecords].sort(
            (a, b) => {
                const dateA =
                    new Date(
                        getRecordDate(a) ||
                            0
                    ).getTime();

                const dateB =
                    new Date(
                        getRecordDate(b) ||
                            0
                    ).getTime();

                return dateB - dateA;
            }
        );
    }, [medicalRecords]);

    const sortedAppointments =
        useMemo(() => {
            return [...appointments].sort(
                (a, b) => {
                    const dateA =
                        getAppointmentDateTime(
                            a
                        )?.getTime() || 0;

                    const dateB =
                        getAppointmentDateTime(
                            b
                        )?.getTime() || 0;

                    return dateB - dateA;
                }
            );
        }, [appointments]);

    const sortedPrescriptions =
        useMemo(() => {
            return [...prescriptions].sort(
                (a, b) => {
                    const dateA =
                        new Date(
                            getPrescriptionDate(
                                a
                            ) || 0
                        ).getTime();

                    const dateB =
                        new Date(
                            getPrescriptionDate(
                                b
                            ) || 0
                        ).getTime();

                    return dateB - dateA;
                }
            );
        }, [prescriptions]);

    /* =========================================================
       RECENT ACTIVITIES
    ========================================================= */

    const recentActivities =
        useMemo(() => {
            const activities = [];

            sortedRecords
                .slice(0, 2)
                .forEach((record) => {
                    activities.push({
                        id: `record-${record.id}`,

                        type: "record",

                        icon: (
                            <FiFileText />
                        ),

                        title:
                            record.diagnosis ||
                            record.treatment ||
                            t(
                                "patientHome.medicalRecordUpdated"
                            ),

                        description:
                            record.notes ||
                            record.treatment ||
                            t(
                                "patientHome.medicalRecordAdded"
                            ),

                        date:
                            getRecordDate(
                                record
                            ),
                    });
                });

            sortedAppointments
                .slice(0, 2)
                .forEach(
                    (appointment) => {
                        activities.push({
                            id: `appointment-${appointment.id}`,

                            type: "appointment",

                            icon: (
                                <FiCalendar />
                            ),

                            title: `${t(
                                "patientHome.appointment"
                            )} ${formatStatus(
                                appointment.status
                            )}`,

                            description: `${formatType(
                                appointment.type
                            )} ${t(
                                "patientHome.with"
                            )} ${getDoctorName(
                                appointment
                            )}.`,

                            date:
                                appointment.created_at ||
                                appointment.updated_at ||
                                appointment.appointment_date,
                        });
                    }
                );

            sortedPrescriptions
                .slice(0, 2)
                .forEach(
                    (prescription) => {
                        activities.push({
                            id: `prescription-${prescription.id}`,

                            type: "prescription",

                            icon: (
                                <FiClipboard />
                            ),

                            title: t(
                                "patientHome.prescriptionAdded"
                            ),

                            description:
                                prescription.notes ||
                                t(
                                    "patientHome.prescriptionAddedDescription"
                                ),

                            date:
                                getPrescriptionDate(
                                    prescription
                                ),
                        });
                    }
                );

            activities.sort(
                (a, b) => {
                    const dateA =
                        new Date(
                            a.date || 0
                        ).getTime();

                    const dateB =
                        new Date(
                            b.date || 0
                        ).getTime();

                    return dateB - dateA;
                }
            );

            return activities.slice(
                0,
                4
            );
        }, [
            sortedRecords,
            sortedAppointments,
            sortedPrescriptions,
            language,
        ]);

    const displayedActivities =
        recentActivities;

    /* =========================================================
       RETURN
    ========================================================= */

    return (
        <div className="patient-layout">

            {sidebarOpen && (
                <button
                    type="button"
                    className="patient-sidebar-overlay"
                    aria-label="Close menu"
                    onClick={closeSidebar}
                />
            )}

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`patient-sidebar ${
                    sidebarOpen ? "is-open" : ""
                }`}
            >

                <div className="sidebar-logo">
                    🦷 Dental Care
                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/patient"
                        end
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiHome />

                        <span>
                            {t(
                                "patientHome.dashboard"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/appointments"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiCalendar />

                        <span>
                            {t(
                                "patientHome.appointments"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/treatment"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiActivity />

                        <span>
                            {t(
                                "patientHome.treatment"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/records"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiFileText />

                        <span>
                            {t(
                                "patientHome.medicalRecords"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/prescriptions"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiClipboard />

                        <span>
                            {t(
                                "patientHome.prescriptions"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/notifications"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiBell />

                        <span>
                            {t(
                                "patientHome.notifications"
                            )}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/patient/profile"
                        className={({
                            isActive,
                        }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                            onClick={closeSidebar}
                    >
                        <FiUser />

                        <span>
                            {t(
                                "patientHome.profile"
                            )}
                        </span>
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                    >
                        <FiLogOut />

                        {t(
                            "patientHome.logout"
                        )}
                    </button>

                </div>

            </aside>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="patient-main">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="patient-header">

                    <div className="header-left-group">
                        <button
                            type="button"
                            className="patient-mobile-toggle"
                            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                            aria-expanded={sidebarOpen}
                            onClick={() =>
                                setSidebarOpen((open) => !open)
                            }
                        >
                            {sidebarOpen ? <FiX /> : <FiMenu />}
                        </button>

                        <div className="header-title">

                            <h1>
                                {t(
                                    "patientHome.dashboard"
                                )}
                            </h1>

                            <p>
                                {t(
                                    "patientHome.welcomeBack"
                                )}
                                ,{" "}
                                {user?.name ||
                                t(
                                    "patientHome.patient"
                                )}{" "}
                                👋
                            </p>

                        </div>
                    </div>

                    <div className="header-actions">

                        {/* LANGUAGE */}

                        <button
                            type="button"
                            className="header-icon-button"
                            aria-label={
                                language ===
                                "en"
                                    ? "Switch to Arabic"
                                    : "Switch to English"
                            }
                            onClick={() =>
                                setLanguage(
                                    language ===
                                        "en"
                                        ? "ar"
                                        : "en"
                                )
                            }
                        >
                            <FiGlobe />

                            <span>
                                {language ===
                                "en"
                                    ? "AR"
                                    : "EN"}
                            </span>
                        </button>

                        {/* THEME */}

                        <button
                            type="button"
                            className="header-icon-button"
                            aria-label={
                                theme ===
                                "dark"
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            onClick={
                                toggleTheme
                            }
                        >
                            {theme ===
                            "dark" ? (
                                <FiSun />
                            ) : (
                                <FiMoon />
                            )}
                        </button>

                        {/* NOTIFICATIONS */}

                        <button
                            type="button"
                            className="notification-button"
                            aria-label={t(
                                "patientHome.notifications"
                            )}
                            onClick={() =>
                                navigate(
                                    "/patient/notifications"
                                )
                            }
                        >
                            <FiBell />

                            {unreadNotifications.length >
                                0 && (
                                <span className="notification-dot">
                                    {unreadNotifications.length >
                                    9
                                        ? "9+"
                                        : unreadNotifications.length}
                                </span>
                            )}
                        </button>

                        {/* USER */}

                        <button
                            type="button"
                            className="user-menu"
                            onClick={() =>
                                navigate(
                                    "/patient/profile"
                                )
                            }
                        >
                            <div className="user-avatar">
                                {user?.name
                                    ?.charAt(
                                        0
                                    )
                                    ?.toUpperCase() ||
                                    "P"}
                            </div>

                            <div className="user-info">

                                <strong>
                                    {user?.name ||
                                        t(
                                            "patientHome.patient"
                                        )}
                                </strong>

                                <span>
                                    {user?.email ||
                                        ""}
                                </span>

                            </div>

                            <FiChevronDown className="user-chevron" />

                        </button>

                    </div>

                </header>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="patient-content">

                    <div className="dashboard">

                        {/* =================================================
                            WELCOME
                        ================================================= */}

                        <div className="dashboard-welcome">

                            <div>

                                <h2>
                                    {getGreeting()}
                                    ,{" "}
                                    {user?.name ||
                                        t(
                                            "patientHome.patient"
                                        )}{" "}
                                    👋
                                </h2>

                                <p>
                                    {t(
                                        "patientHome.welcomeDescription"
                                    )}
                                </p>

                            </div>

                            <div className="welcome-icon">
                                🦷
                            </div>

                        </div>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (
                            <div className="error-text">

                                {error}

                                <button
                                    type="button"
                                    onClick={
                                        loadDashboard
                                    }
                                >
                                    <FiRefreshCw />

                                    {t(
                                        "patientHome.retry"
                                    )}
                                </button>

                            </div>
                        )}

                        {/* =================================================
                            MAIN CARDS
                        ================================================= */}

                        <div className="dashboard-grid">

                            {/* APPOINTMENT */}

                            <div className="dashboard-card">

                                <div className="card-header">

                                    <div>

                                        <span className="card-label">
                                            {t(
                                                "patientHome.nextAppointment"
                                            ).toUpperCase()}
                                        </span>

                                        <h3>
                                            {loading
                                                ? t(
                                                      "patientHome.loading"
                                                  )
                                                : nextAppointment
                                                ? formatType(
                                                      nextAppointment.type
                                                  )
                                                : t(
                                                      "patientHome.noUpcomingAppointment"
                                                  )}
                                        </h3>

                                    </div>

                                    <div className="card-icon">
                                        <FiCalendar />
                                    </div>

                                </div>

                                <div className="appointment-details">

                                    <div>

                                        <span>
                                            {t(
                                                "patientHome.date"
                                            )}
                                        </span>

                                        <strong>
                                            {nextAppointment
                                                ? formatDate(
                                                      nextAppointment.appointment_date
                                                  )
                                                : "--"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            {t(
                                                "patientHome.time"
                                            )}
                                        </span>

                                        <strong>
                                            {nextAppointment
                                                ? formatTime(
                                                      nextAppointment.appointment_time
                                                  )
                                                : "--"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            {t(
                                                "patientHome.doctor"
                                            )}
                                        </span>

                                        <strong>
                                            {nextAppointment
                                                ? getDoctorName(
                                                      nextAppointment
                                                  )
                                                : "--"}
                                        </strong>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="card-action"
                                    onClick={() =>
                                        navigate(
                                            "/patient/appointments"
                                        )
                                    }
                                >
                                    {t(
                                        "patientHome.viewAppointments"
                                    )}
                                </button>

                            </div>

                            {/* MEDICAL RECORDS */}

                            <div className="dashboard-card">

                                <div className="card-header">

                                    <div>

                                        <span className="card-label">
                                            {t(
                                                "patientHome.medicalRecords"
                                            ).toUpperCase()}
                                        </span>

                                        <h3>
                                            {loading
                                                ? t(
                                                      "patientHome.loading"
                                                  )
                                                : `${medicalRecords.length} ${
                                                      medicalRecords.length ===
                                                      1
                                                          ? t(
                                                                "patientHome.record"
                                                            )
                                                          : t(
                                                                "patientHome.records"
                                                            )
                                                  }`}
                                        </h3>

                                    </div>

                                    <div className="card-icon">
                                        <FiFileText />
                                    </div>

                                </div>

                                <div className="progress-content">

                                    <div className="progress-number">

                                        <strong>
                                            {
                                                medicalRecords.length
                                            }
                                        </strong>

                                        <span>
                                            {t(
                                                "patientHome.available"
                                            )}
                                        </span>

                                    </div>

                                    <p>
                                        {t(
                                            "patientHome.recordsDescription"
                                        )}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="card-action"
                                    onClick={() =>
                                        navigate(
                                            "/patient/records"
                                        )
                                    }
                                >
                                    {t(
                                        "patientHome.viewMedicalRecords"
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <div className="section-title">

                            <h3>
                                {t(
                                    "patientHome.quickActions"
                                )}
                            </h3>

                        </div>

                        <div className="quick-actions">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/appointments/book"
                                    )
                                }
                            >
                                <div className="quick-icon">
                                    <FiCalendar />
                                </div>

                                <div>

                                    <strong>
                                        {t(
                                            "patientHome.bookAppointment"
                                        )}
                                    </strong>

                                    <small>
                                        {t(
                                            "patientHome.bookAppointmentDescription"
                                        )}
                                    </small>

                                </div>

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/records"
                                    )
                                }
                            >
                                <div className="quick-icon">
                                    <FiFileText />
                                </div>

                                <div>

                                    <strong>
                                        {t(
                                            "patientHome.medicalRecords"
                                        )}
                                    </strong>

                                    <small>
                                        {t(
                                            "patientHome.recordsDescriptionShort"
                                        )}
                                    </small>

                                </div>

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/prescriptions"
                                    )
                                }
                            >
                                <div className="quick-icon">
                                    <FiClipboard />
                                </div>

                                <div>

                                    <strong>
                                        {t(
                                            "patientHome.prescriptions"
                                        )}
                                    </strong>

                                    <small>
                                        {t(
                                            "patientHome.prescriptionsDescription"
                                        )}
                                    </small>

                                </div>

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/patient/profile"
                                    )
                                }
                            >
                                <div className="quick-icon">
                                    <FiUser />
                                </div>

                                <div>

                                    <strong>
                                        {t(
                                            "patientHome.profile"
                                        )}
                                    </strong>

                                    <small>
                                        {t(
                                            "patientHome.profileDescription"
                                        )}
                                    </small>

                                </div>

                            </button>

                        </div>

                        {/* =================================================
                            RECENT ACTIVITY
                        ================================================= */}

                        <div className="section-title">

                            <h3>
                                {t(
                                    "patientHome.recentActivity"
                                )}
                            </h3>

                        </div>

                        <div className="activity-card">

                            {loading ? (
                                <div className="activity-item">

                                    <div className="activity-info">

                                        <strong>
                                            {t(
                                                "patientHome.loadingActivity"
                                            )}
                                        </strong>

                                    </div>

                                </div>
                            ) : displayedActivities.length ===
                              0 ? (
                                <div className="activity-item">

                                    <div className="activity-icon">
                                        <FiActivity />
                                    </div>

                                    <div className="activity-info">

                                        <strong>
                                            {t(
                                                "patientHome.noRecentActivity"
                                            )}
                                        </strong>

                                        <p>
                                            {t(
                                                "patientHome.noRecentActivityDescription"
                                            )}
                                        </p>

                                    </div>

                                </div>
                            ) : (
                                displayedActivities.map(
                                    (activity) => (
                                        <div
                                            className="activity-item"
                                            key={
                                                activity.id
                                            }
                                        >

                                            <div className="activity-icon">
                                                {
                                                    activity.icon
                                                }
                                            </div>

                                            <div className="activity-info">

                                                <strong>
                                                    {
                                                        activity.title
                                                    }
                                                </strong>

                                                <p>
                                                    {
                                                        activity.description
                                                    }
                                                </p>

                                            </div>

                                            <span className="activity-time">
                                                {formatRelativeDate(
                                                    activity.date
                                                )}
                                            </span>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default PatientHome;
