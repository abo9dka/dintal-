import { useEffect, useState } from "react";

import {
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiActivity,
    FiAlertCircle,
    FiRefreshCw,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorHome() {
    const {
        t,
        language,
    } = useLanguage();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await doctorService.getDashboard();

            setDashboard(data);
        } catch (err) {
            console.error(
                "Doctor dashboard error:",
                err
            );

            setError(t("dashboard.failed"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [language]);

    if (loading) {
        return (
            <div className="doctor-dashboard-state">
                <div className="doctor-spinner"></div>

                <p>
                    {t("dashboard.loading")}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doctor-dashboard-state doctor-dashboard-error">
                <FiAlertCircle size={24} />

                <p>{error}</p>

                <button
                    type="button"
                    onClick={loadDashboard}
                    className="doctor-retry-button"
                >
                    <FiRefreshCw size={16} />

                    {t("dashboard.tryAgain")}
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-dashboard">

            <div className="doctor-dashboard-header">
                <div>
                    <span className="doctor-dashboard-eyebrow">
                        {t("dashboard.eyebrow")}
                    </span>

                    <h1>
                        {t("dashboard.greeting")}
                    </h1>

                    <p>
                        {t("dashboard.description")}
                    </p>
                </div>

                <button
                    type="button"
                    className="doctor-refresh-button"
                    onClick={loadDashboard}
                    title={t("dashboard.refresh")}
                    aria-label={t("dashboard.refresh")}
                >
                    <FiRefreshCw size={18} />
                </button>
            </div>


            <div className="doctor-stat-grid">

                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        <FiCalendar />
                    </div>

                    <div className="doctor-stat-content">
                        <span>
                            {t(
                                "dashboard.totalAppointments"
                            )}
                        </span>

                        <strong>
                            {dashboard?.appointments_count ?? 0}
                        </strong>
                    </div>
                </div>


                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        <FiClock />
                    </div>

                    <div className="doctor-stat-content">
                        <span>
                            {t(
                                "dashboard.todayAppointments"
                            )}
                        </span>

                        <strong>
                            {dashboard?.today_appointments ?? 0}
                        </strong>
                    </div>
                </div>


                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        <FiActivity />
                    </div>

                    <div className="doctor-stat-content">
                        <span>
                            {t("dashboard.pending")}
                        </span>

                        <strong>
                            {dashboard?.pending_appointments ?? 0}
                        </strong>
                    </div>
                </div>


                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        <FiCheckCircle />
                    </div>

                    <div className="doctor-stat-content">
                        <span>
                            {t("dashboard.completed")}
                        </span>

                        <strong>
                            {dashboard?.completed_appointments ?? 0}
                        </strong>
                    </div>
                </div>

            </div>


            <div className="doctor-overview-card">

                <div className="doctor-overview-header">
                    <div>
                        <h2>
                            {t(
                                "dashboard.overviewTitle"
                            )}
                        </h2>

                        <p>
                            {t(
                                "dashboard.overviewDescription"
                            )}
                        </p>
                    </div>
                </div>


                <div className="doctor-overview-grid">

                    <div className="doctor-overview-item">
                        <span>
                            {t("dashboard.pending")}
                        </span>

                        <strong>
                            {dashboard?.pending_appointments ?? 0}
                        </strong>
                    </div>


                    <div className="doctor-overview-item">
                        <span>
                            {t("dashboard.confirmed")}
                        </span>

                        <strong>
                            {dashboard?.confirmed_appointments ?? 0}
                        </strong>
                    </div>


                    <div className="doctor-overview-item">
                        <span>
                            {t("dashboard.completed")}
                        </span>

                        <strong>
                            {dashboard?.completed_appointments ?? 0}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default DoctorHome;
