import { useEffect, useMemo, useState } from "react";

import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiMail,
    FiRefreshCw,
    FiSave,
    FiUser,
    FiX,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const DAYS = [
    { value: "monday", key: "monday" },
    { value: "tuesday", key: "tuesday" },
    { value: "wednesday", key: "wednesday" },
    { value: "thursday", key: "thursday" },
    { value: "friday", key: "friday" },
    { value: "saturday", key: "saturday" },
    { value: "sunday", key: "sunday" },
];

const EMPTY_PROFILE = {
    name: "",
    email: "",
    specialization: "",
};

function DoctorProfile() {
    const { getCurrentUser } = useAuth();
    const { t } = useLanguage();

    const [profile, setProfile] =
        useState(EMPTY_PROFILE);

    const [workingHours, setWorkingHours] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data =
                await doctorService.getProfile();

            const doctor = data?.doctor || data;
            const user = doctor?.user || {};

            setProfile({
                name:
                    user?.name ||
                    doctor?.name ||
                    "",

                email:
                    user?.email ||
                    doctor?.email ||
                    "",

                specialization:
                    doctor?.specialization ||
                    "",
            });

            const hours =
                doctor?.workingHours ||
                doctor?.working_hours ||
                data?.workingHours ||
                data?.working_hours ||
                [];

            setWorkingHours(
                Array.isArray(hours) ? hours : []
            );
        } catch (err) {
            console.error(
                "Failed to load doctor profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("doctorProfile.loadFailed")
            );
        } finally {
            setLoading(false);
        }
    };

    const getApiError = (err) => {
        const responseData = err.response?.data;

        if (responseData?.errors) {
            const firstError = Object.values(
                responseData.errors
            )[0];

            if (Array.isArray(firstError)) {
                return firstError[0];
            }

            if (typeof firstError === "string") {
                return firstError;
            }
        }

        return (
            responseData?.message ||
            t("doctorProfile.somethingWentWrong")
        );
    };

    const getInitials = (name) => {
        if (!name) {
            return "DR";
        }

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {
            return words[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    };

    const getDayLabel = (day) => {
        const found = DAYS.find(
            (item) =>
                item.value ===
                String(day || "").toLowerCase()
        );

        return found
            ? t(`doctorProfile.days.${found.key}`)
            : day ||
                  t("doctorProfile.unknown");
    };

    const normalizeTime = (time) => {
        if (!time) {
            return "--:--";
        }

        return String(time).slice(0, 5);
    };

    const isActive = (hour) => {
        return (
            hour?.is_active === true ||
            hour?.is_active === 1 ||
            hour?.is_active === "1"
        );
    };

    const sortedWorkingHours = useMemo(() => {
        return [...workingHours]
            .filter((hour) => isActive(hour))
            .sort((a, b) => {
                const aIndex = DAYS.findIndex(
                    (day) =>
                        day.value ===
                        String(
                            a.day_of_week
                        ).toLowerCase()
                );

                const bIndex = DAYS.findIndex(
                    (day) =>
                        day.value ===
                        String(
                            b.day_of_week
                        ).toLowerCase()
                );

                return aIndex - bIndex;
            });
    }, [workingHours]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleStartEdit = () => {
        setError("");
        setSuccess("");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError("");
        loadProfile();
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!profile.name.trim()) {
            setError(
                t("doctorProfile.nameRequired")
            );
            return;
        }

        if (!profile.specialization.trim()) {
            setError(
                t(
                    "doctorProfile.specializationRequired"
                )
            );
            return;
        }

        try {
            setSaving(true);

            const response =
                await doctorService.updateProfile({
                    name: profile.name.trim(),
                    specialization:
                        profile.specialization.trim(),
                });

            const updatedDoctor =
                response?.doctor ||
                response;

            const updatedUser =
                updatedDoctor?.user || {};

            setProfile((previous) => ({
                ...previous,

                name:
                    updatedUser?.name ||
                    updatedDoctor?.name ||
                    previous.name,

                email:
                    updatedUser?.email ||
                    updatedDoctor?.email ||
                    previous.email,

                specialization:
                    updatedDoctor?.specialization ||
                    previous.specialization,
            }));

            setIsEditing(false);

            setSuccess(
                t("doctorProfile.updateSuccess")
            );

            try {
                await getCurrentUser();
            } catch (refreshError) {
                console.error(
                    "Failed to refresh authenticated user:",
                    refreshError
                );
            }
        } catch (err) {
            console.error(
                "Failed to update doctor profile:",
                err
            );

            setError(getApiError(err));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="doctor-profile-loading">
                <div className="doctor-profile-spinner"></div>

                <p>
                    {t(
                        "doctorProfile.loading"
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="doctor-profile-page">
            {/* HEADER */}

            <div className="doctor-profile-page-header">
                <div className="doctor-profile-title">
                    <div className="doctor-profile-title-icon">
                        <FiUser />
                    </div>

                    <div>
                        <h1>
                            {t(
                                "doctorProfile.title"
                            )}
                        </h1>

                        <p>
                            {t(
                                "doctorProfile.description"
                            )}
                        </p>
                    </div>
                </div>

                <div className="doctor-profile-header-actions">
                    <button
                        type="button"
                        className="doctor-profile-refresh-button"
                        onClick={loadProfile}
                        disabled={loading}
                    >
                        <FiRefreshCw />

                        <span>
                            {t(
                                "doctorProfile.refresh"
                            )}
                        </span>
                    </button>

                    {!isEditing && (
                        <button
                            type="button"
                            className="doctor-profile-edit-button"
                            onClick={
                                handleStartEdit
                            }
                        >
                            <FiEdit3 />

                            <span>
                                {t(
                                    "doctorProfile.editProfile"
                                )}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* ALERTS */}

            {error && (
                <div className="doctor-profile-alert error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        <FiX />
                    </button>
                </div>
            )}

            {success && (
                <div className="doctor-profile-alert success">
                    <FiCheckCircle />

                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        <FiX />
                    </button>
                </div>
            )}

            {/* PROFILE HERO */}

            <section className="doctor-profile-hero">
                <div className="doctor-profile-avatar">
                    {getInitials(profile.name)}
                </div>

                <div className="doctor-profile-hero-info">
                    <div className="doctor-profile-name-row">
                        <h2>
                            {profile.name ||
                                t(
                                    "doctorProfile.doctor"
                                )}
                        </h2>

                        <span className="doctor-profile-status">
                            <span></span>

                            {t(
                                "doctorProfile.active"
                            )}
                        </span>
                    </div>

                    <p className="doctor-profile-email">
                        <FiMail />

                        {profile.email ||
                            t(
                                "doctorProfile.noEmail"
                            )}
                    </p>

                    <div className="doctor-profile-specialization">
                        <span>
                            {profile.specialization ||
                                t(
                                    "doctorProfile.dentalSpecialist"
                                )}
                        </span>
                    </div>
                </div>

                <div className="doctor-profile-role">
                    <span>
                        {t(
                            "doctorProfile.accountType"
                        )}
                    </span>

                    <strong>
                        {t(
                            "doctorProfile.doctor"
                        )}
                    </strong>
                </div>
            </section>

            {/* MAIN CONTENT */}

            <div className="doctor-profile-content">
                {/* PROFESSIONAL INFORMATION */}

                <section className="doctor-profile-card">
                    <div className="doctor-profile-card-header">
                        <div className="doctor-profile-card-icon">
                            <FiUser />
                        </div>

                        <div>
                            <h3>
                                {t(
                                    "doctorProfile.professionalInformation"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "doctorProfile.professionalDescription"
                                )}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSave}
                        className="doctor-profile-form"
                    >
                        <div className="doctor-profile-form-grid">
                            {/* NAME */}

                            <div className="doctor-profile-field">
                                <label htmlFor="doctor-name">
                                    {t(
                                        "doctorProfile.fullName"
                                    )}
                                </label>

                                <div className="doctor-profile-input-wrapper">
                                    <FiUser />

                                    <input
                                        id="doctor-name"
                                        type="text"
                                        name="name"
                                        value={
                                            profile.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            !isEditing ||
                                            saving
                                        }
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}

                            <div className="doctor-profile-field">
                                <label htmlFor="doctor-email">
                                    {t(
                                        "doctorProfile.emailAddress"
                                    )}
                                </label>

                                <div className="doctor-profile-input-wrapper readonly">
                                    <FiMail />

                                    <input
                                        id="doctor-email"
                                        type="email"
                                        value={
                                            profile.email
                                        }
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <small>
                                    {t(
                                        "doctorProfile.emailCannotChange"
                                    )}
                                </small>
                            </div>

                            {/* SPECIALIZATION */}

                            <div className="doctor-profile-field full">
                                <label htmlFor="doctor-specialization">
                                    {t(
                                        "doctorProfile.specialization"
                                    )}
                                </label>

                                <div className="doctor-profile-input-wrapper">
                                    <FiCheckCircle />

                                    <input
                                        id="doctor-specialization"
                                        type="text"
                                        name="specialization"
                                        value={
                                            profile.specialization
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            !isEditing ||
                                            saving
                                        }
                                        placeholder={t(
                                            "doctorProfile.specializationPlaceholder"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="doctor-profile-form-actions">
                                <button
                                    type="button"
                                    className="doctor-profile-cancel-button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                    disabled={saving}
                                >
                                    <FiX />

                                    {t(
                                        "doctorProfile.cancel"
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    className="doctor-profile-save-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="doctor-profile-button-spinner"></span>

                                            {t(
                                                "doctorProfile.saving"
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <FiSave />

                                            {t(
                                                "doctorProfile.saveChanges"
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </section>

                {/* WORKING HOURS */}

                <section className="doctor-profile-card">
                    <div className="doctor-profile-card-header">
                        <div className="doctor-profile-card-icon">
                            <FiClock />
                        </div>

                        <div>
                            <h3>
                                {t(
                                    "doctorProfile.weeklyAvailability"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "doctorProfile.weeklyDescription"
                                )}
                            </p>
                        </div>
                    </div>

                    {sortedWorkingHours.length ===
                    0 ? (
                        <div className="doctor-profile-no-hours">
                            <FiClock />

                            <div>
                                <strong>
                                    {t(
                                        "doctorProfile.noActiveHours"
                                    )}
                                </strong>

                                <p>
                                    {t(
                                        "doctorProfile.noActiveHoursDescription"
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="doctor-profile-hours-list">
                            {sortedWorkingHours.map(
                                (hour) => (
                                    <div
                                        className="doctor-profile-hour-row"
                                        key={hour.id}
                                    >
                                        <div className="doctor-profile-hour-day">
                                            <div className="doctor-profile-hour-icon">
                                                <FiCalendar />
                                            </div>

                                            <strong>
                                                {getDayLabel(
                                                    hour.day_of_week
                                                )}
                                            </strong>
                                        </div>

                                        <div className="doctor-profile-hour-time">
                                            <FiClock />

                                            <span>
                                                {normalizeTime(
                                                    hour.start_time
                                                )}
                                            </span>

                                            <b>
                                                →
                                            </b>

                                            <span>
                                                {normalizeTime(
                                                    hour.end_time
                                                )}
                                            </span>
                                        </div>

                                        <span className="doctor-profile-hour-active">
                                            {t(
                                                "doctorProfile.active"
                                            )}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default DoctorProfile;