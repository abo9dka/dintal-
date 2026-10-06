import { FiGlobe } from "react-icons/fi";

import { useLanguage } from "../../context/LanguageContext";

function LanguageToggle() {
    const {
        language,
        toggleLanguage,
    } = useLanguage();

    return (
        <button
            type="button"
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={
                language === "ar"
                    ? "Switch to English"
                    : "التبديل إلى العربية"
            }
            title={
                language === "ar"
                    ? "English"
                    : "العربية"
            }
        >
            <FiGlobe size={18} />

            <span>
                {language === "en" ? "AR" : "EN"}
            </span>
        </button>
    );
}

export default LanguageToggle;
