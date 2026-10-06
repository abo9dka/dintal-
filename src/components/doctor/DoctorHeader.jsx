import {
    FiBell,
    FiGlobe,
    FiMenu,
    FiMoon,
    FiSearch,
    FiSun,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

function DoctorHeader({ onMenuClick }) {
    const navigate = useNavigate();

    const { user } = useAuth();

    const {
        language,
        toggleLanguage,
        t,
    } = useLanguage();

    const doctorName = user?.name
        ? language === "ar"
            ? `د. ${user.name.replace(/^Dr\.?\s*/i, "")}`
            : `Dr. ${user.name}`
        : language === "ar"
            ? "طبيب"
            : "Doctor";

    const {
        isDark,
        toggleTheme,
    } = useTheme();

    return (
        <header className="doctor-header">

            <div className="doctor-header-left">

                <button
                    type="button"
                    className="doctor-menu-button"
                    onClick={onMenuClick}
                    aria-label={
                        language === "ar"
                            ? "فتح القائمة"
                            : "Open menu"
                    }
                >
                    <FiMenu size={22} />
                </button>


                <div className="doctor-header-search">

                    <FiSearch size={18} />

                    <input
                        type="text"
                        placeholder={t(
                            "header.search"
                        )}
                        aria-label={t(
                            "header.searchAria"
                        )}
                    />

                </div>

            </div>


            <div className="doctor-header-right">

                <button
                    type="button"
                    className="doctor-header-action-button doctor-language-button"
                    onClick={toggleLanguage}
                    aria-label={
                        language === "ar"
                            ? t(
                                  "header.switchToEnglish"
                              )
                            : t(
                                  "header.switchToArabic"
                              )
                    }
                    title={
                        language === "ar"
                            ? t(
                                  "header.english"
                              )
                            : t(
                                  "header.arabic"
                              )
                    }
                >
                    <FiGlobe size={18} />

                    <span>
                        {language === "ar"
                            ? "EN"
                            : "AR"}
                    </span>
                </button>


                <button
                    type="button"
                    className="doctor-header-action-button"
                    onClick={toggleTheme}
                    aria-label={
                        isDark
                            ? t(
                                  "header.switchToLight"
                              )
                            : t(
                                  "header.switchToDark"
                              )
                    }
                    title={
                        isDark
                            ? t(
                                  "header.lightMode"
                              )
                            : t(
                                  "header.darkMode"
                              )
                    }
                >
                    {isDark ? (
                        <FiSun size={19} />
                    ) : (
                        <FiMoon size={19} />
                    )}
                </button>


                <button
                    type="button"
                    className="doctor-notification-button"
                    onClick={() =>
                        navigate(
                            "/doctor/notifications"
                        )
                    }
                    aria-label={t(
                        "header.notifications"
                    )}
                >
                    <FiBell size={20} />

                    <span className="doctor-notification-dot" />
                </button>


                <button
                    type="button"
                    className="doctor-header-profile"
                    onClick={() =>
                        navigate(
                            "/doctor/profile"
                        )
                    }
                >
                    <div className="doctor-header-avatar">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "D"}
                    </div>

                    <div className="doctor-header-user">

                        <strong>
                            {doctorName}
                        </strong>

                        <span>
                            {t("header.doctor")}
                        </span>

                    </div>
                </button>

            </div>

        </header>
    );
}

export default DoctorHeader;
