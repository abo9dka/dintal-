import { useState } from "react";
import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FiHome,
    FiCalendar,
    FiActivity,
    FiFileText,
    FiClipboard,
    FiBell,
    FiUser,
    FiLogOut,
    FiSun,
    FiMoon,
    FiGlobe,
    FiChevronDown,
    FiMenu,
    FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

function PatientLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user, logout } = useAuth();

    const {
        language,
        setLanguage,
        t,
    } = useLanguage();

    const {
        theme,
        toggleTheme,
    } = useTheme();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleLanguageToggle = () => {
        setLanguage(
            language === "en"
                ? "ar"
                : "en"
        );
    };

    const closeSidebar = () => setSidebarOpen(false);

    const toggleSidebar = () =>
        setSidebarOpen((open) => !open);

const pageTitles = {
    "/patient": "patientHome.dashboard",
    "/patient/appointments":
        "patientHome.appointments",
    "/patient/treatment":
        "patientHome.treatment",
    "/patient/records":
        "patientHome.medicalRecords",
    "/patient/prescriptions":
        "patientHome.prescriptions",
    "/patient/notifications":
        "patientHome.notifications",
    "/patient/profile":
        "patientHome.profile",
};

const currentPage =
    pageTitles[location.pathname] ||
    "patientHome.dashboard";

const isDashboard =
    location.pathname === "/patient";
    return (
        <div className="patient-inner-layout">
            {sidebarOpen && (
                <button
                    type="button"
                    className="patient-sidebar-overlay"
                    aria-label="Close menu"
                    onClick={closeSidebar}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`patient-sidebar ${
                    sidebarOpen ? "is-open" : ""
                }`}
            >

                <div className="sidebar-logo">
                    🦷 Dental Care
                </div>

                <nav className="sidebar-nav">

                    <NavItem
                        to="/patient"
                        icon={<FiHome />}
                        label={t(
                            "patientHome.dashboard"
                        )}
                        end
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/appointments"
                        icon={<FiCalendar />}
                        label={t(
                            "patientHome.appointments"
                        )}
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/treatment"
                        icon={<FiActivity />}
                        label={t(
                            "patientHome.treatment"
                        )}
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/records"
                        icon={<FiFileText />}
                        label={t(
                            "patientHome.medicalRecords"
                        )}
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/prescriptions"
                        icon={<FiClipboard />}
                        label={t(
                            "patientHome.prescriptions"
                        )}
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/notifications"
                        icon={<FiBell />}
                        label={t(
                            "patientHome.notifications"
                        )}
                        onClick={closeSidebar}
                    />

                    <NavItem
                        to="/patient/profile"
                        icon={<FiUser />}
                        label={t(
                            "patientHome.profile"
                        )}
                        onClick={closeSidebar}
                    />

                </nav>

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        onClick={() => {
                            closeSidebar();
                            handleLogout();
                        }}
                    >
                        <FiLogOut />

                        {t(
                            "patientHome.logout"
                        )}
                    </button>

                </div>

            </aside>

            {/* MAIN */}
            <main className="patient-inner-main">

                {/* HEADER */}
                <header className="patient-header">
                    <div className="header-left-group">
                        <button
                            type="button"
                            className="patient-mobile-toggle"
                            onClick={toggleSidebar}
                            aria-label="Open menu"
                        >
                            {sidebarOpen ? <FiX /> : <FiMenu />}
                        </button>

                        <div className="header-title">
                            <h1>
                                {t(currentPage)}
                            </h1>

                            {isDashboard && (
                                <p>
                                    {t("patientHome.welcomeBack")} {user?.name || t("patientHome.patient")} 👋
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="header-actions">

                        {/* LANGUAGE */}
                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={
                                handleLanguageToggle
                            }
                            title={
                                language === "en"
                                    ? "العربية"
                                    : "English"
                            }
                        >
                            <FiGlobe />

                            <span>
                                {language === "en"
                                    ? "AR"
                                    : "EN"}
                            </span>
                        </button>

                        {/* THEME */}
                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={
                                toggleTheme
                            }
                            title={
                                theme === "dark"
                                    ? "Light mode"
                                    : "Dark mode"
                            }
                        >
                            {theme === "dark" ? (
                                <FiSun />
                            ) : (
                                <FiMoon />
                            )}
                        </button>

                        {/* NOTIFICATIONS */}
                        <button
                            type="button"
                            className="notification-button"
                            onClick={() =>
                                navigate(
                                    "/patient/notifications"
                                )
                            }
                            title={t(
                                "patientHome.notifications"
                            )}
                        >
                            <FiBell />
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
                                    ?.charAt(0)
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
                                    {user?.email || ""}
                                </span>

                            </div>

                            <FiChevronDown className="user-chevron" />

                        </button>

                    </div>

                </header>

                {/* PAGE CONTENT */}
                <section className="patient-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

function NavItem({
    to,
    icon,
    label,
    end = false,
    onClick,
}) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                isActive ? "active" : ""
            }
        >
            {icon}

            <span>
                {label}
            </span>
        </NavLink>
    );
}

export default PatientLayout;