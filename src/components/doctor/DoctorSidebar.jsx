import { NavLink, useNavigate } from "react-router-dom";

import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiFileText,
    FiClipboard,
    FiClock,
    FiUser,
    FiLogOut,
    FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

function DoctorSidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const { t, language } = useLanguage();

    const doctorName = user?.name
        ? language === "ar"
            ? `د. ${user.name.replace(/^Dr\.?\s*/i, "")}`
            : `Dr. ${user.name}`
        : language === "ar"
            ? "طبيب"
            : "Doctor";

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login", {
                replace: true,
            });
        }
    };

    const navItems = [
        {
            label: t("sidebar.dashboard"),
            path: "/doctor",
            icon: FiHome,
        },
        {
            label: t("sidebar.appointments"),
            path: "/doctor/appointments",
            icon: FiCalendar,
        },
        {
            label: t("sidebar.patients"),
            path: "/doctor/patients",
            icon: FiUsers,
        },
        {
            label: t("sidebar.medicalRecords"),
            path: "/doctor/medical-records",
            icon: FiFileText,
        },
        {
            label: t("sidebar.prescriptions"),
            path: "/doctor/prescriptions",
            icon: FiClipboard,
        },
        {
            label: t("sidebar.workingHours"),
            path: "/doctor/working-hours",
            icon: FiClock,
        },
        {
            label: t("sidebar.profile"),
            path: "/doctor/profile",
            icon: FiUser,
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="doctor-sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`doctor-sidebar ${
                    isOpen
                        ? "doctor-sidebar-open"
                        : ""
                }`}
            >

                {/* Top */}
                <div className="doctor-sidebar-top">

                    <div className="doctor-brand">

                        <div className="doctor-brand-icon">
                            🦷
                        </div>

                        <div>
                            <strong>
                                {language === "ar"
                                    ? "عيادة الأسنان"
                                    : "DentalCare"}
                            </strong>

                            <span>
                                {t(
                                    "sidebar.doctorPortal"
                                )}
                            </span>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="doctor-sidebar-close"
                        onClick={onClose}
                        aria-label={t(
                            "sidebar.closeMenu"
                        )}
                    >
                        <FiX />
                    </button>

                </div>


                {/* Doctor mini profile */}
                <div className="doctor-profile-mini">

                    <div className="doctor-avatar">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "D"}
                    </div>

                    <div className="doctor-profile-mini-info">

                        <strong>
                            {doctorName}
                        </strong>

                        <span>
                            {t("sidebar.doctor")}
                        </span>

                    </div>

                </div>


                {/* Navigation */}
                <nav className="doctor-sidebar-nav">

                    <span className="doctor-nav-title">
                        {t("sidebar.mainMenu")}
                    </span>

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={
                                    item.path ===
                                    "/doctor"
                                }
                                onClick={onClose}
                                className={({
                                    isActive,
                                }) =>
                                    `doctor-nav-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon size={19} />

                                <span>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}

                </nav>


                {/* Logout */}
                <div className="doctor-sidebar-bottom">

                    <button
                        type="button"
                        className="doctor-logout-button"
                        onClick={handleLogout}
                    >
                        <FiLogOut size={19} />

                        <span>
                            {t("sidebar.logout")}
                        </span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default DoctorSidebar;
