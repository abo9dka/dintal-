import {
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiMapPin,
    FiEdit3,
    FiLock,
    FiBell,
    FiSave,
    FiX,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import { useEffect, useState } from "react";

import patientService from "../../services/patientService";

import { useAuth } from "../../context/AuthContext";

import { useLanguage } from "../../context/LanguageContext";

function Profile() {
    const { user } = useAuth();
    const { t } = useLanguage();

    const [isEditing, setIsEditing] = useState(false);

    const [saved, setSaved] = useState(false);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [changingPassword, setChangingPassword] = useState(false);

    const [error, setError] = useState("");

    const [passwordSuccess, setPasswordSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
    });

    /*
     * Password fields are intentionally kept empty.
     *
     * We NEVER load or display a password from the backend.
     * The backend should only store a hashed password.
     */
    const [passwords, setPasswords] = useState({
        current: "",
        newPassword: "",
        confirm: "",
    });

    /*
     * Notification settings are currently frontend-only.
     *
     * The current backend does not have an endpoint
     * for saving these preferences.
     */
    const [settings, setSettings] = useState({
        emailNotifications: true,
        appointmentReminders: true,
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await patientService.getProfile();

            const patient = data?.patient || data;

            const patientUser =
                patient?.user ||
                data?.user ||
                user;

            setProfile({
                fullName:
                    patientUser?.name ||
                    user?.name ||
                    "",

                email:
                    patientUser?.email ||
                    user?.email ||
                    "",

                phone:
                    patient?.phone ||
                    "",

                dateOfBirth:
                    patient?.date_of_birth ||
                    "",

                gender:
                    patient?.gender ||
                    "",

                address:
                    patient?.address ||
                    "",
            });

            /*
             * Important:
             * Never assign any password from the API here.
             *
             * Always keep password fields empty when
             * loading the profile.
             */
            setPasswords({
                current: "",
                newPassword: "",
                confirm: "",
            });

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.error(
                "Profile loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    t("profile.unableToLoad")
            );
        } finally {
            setLoading(false);
        }
    };

    const getFirstValidationError = (error) => {
        const validationErrors =
            error.response?.data?.errors;

        if (!validationErrors) {
            return null;
        }

        return Object.values(validationErrors)
            .flat()
            .find(Boolean);
    };

    const handleChange = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSaved(false);
        setError("");
    };

    const handleSave = async () => {
        if (saving) {
            return;
        }

        setSaving(true);
        setSaved(false);
        setError("");

        try {
            const updatedPatient =
                await patientService.updateProfile({
                    phone: profile.phone || null,

                    date_of_birth:
                        profile.dateOfBirth || null,

                    gender:
                        profile.gender || null,

                    address:
                        profile.address || null,
                });

            const patient =
                updatedPatient?.patient ||
                updatedPatient;

            const updatedUser =
                patient?.user ||
                updatedPatient?.user ||
                user;

            setProfile((prev) => ({
                ...prev,

                fullName:
                    updatedUser?.name ||
                    prev.fullName,

                email:
                    updatedUser?.email ||
                    prev.email,

                phone:
                    patient?.phone ??
                    prev.phone,

                dateOfBirth:
                    patient?.date_of_birth ??
                    prev.dateOfBirth,

                gender:
                    patient?.gender ??
                    prev.gender,

                address:
                    patient?.address ??
                    prev.address,
            }));

            setIsEditing(false);

            setSaved(true);

            window.setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setError(
                getFirstValidationError(error) ||
                    error.response?.data?.message ||
                    t("profile.unableToUpdate")
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (saving) {
            return;
        }

        setIsEditing(false);

        setError("");

        setSaved(false);

        loadProfile();
    };

    const handlePasswordChange = (
        field,
        value
    ) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));

        setPasswordSuccess("");

        setError("");
    };

    const handleUpdatePassword = async () => {
        if (changingPassword) {
            return;
        }

        setError("");

        setPasswordSuccess("");

        if (!passwords.current) {
            setError(
                t(
                    "profile.currentPasswordRequired"
                )
            );

            return;
        }

        if (!passwords.newPassword) {
            setError(
                t(
                    "profile.newPasswordRequired"
                )
            );

            return;
        }

        if (passwords.newPassword.length < 8) {
            setError(
                t(
                    "profile.passwordMinLength"
                )
            );

            return;
        }

        if (!passwords.confirm) {
            setError(
                t(
                    "profile.confirmPasswordRequired"
                )
            );

            return;
        }

        if (
            passwords.newPassword !==
            passwords.confirm
        ) {
            setError(
                t(
                    "profile.passwordsDoNotMatch"
                )
            );

            return;
        }

        setChangingPassword(true);

        try {
            const result =
                await patientService.changePassword({
                    current_password:
                        passwords.current,

                    new_password:
                        passwords.newPassword,

                    new_password_confirmation:
                        passwords.confirm,
                });

            /*
             * Backend deletes the old tokens
             * and creates a new token.
             *
             * Store the new token so the current
             * session remains authenticated.
             */
            if (result?.token) {
                localStorage.setItem(
                    "token",
                    result.token
                );
            }

            /*
             * Clear all password fields after
             * successful password change.
             */
            setPasswords({
                current: "",
                newPassword: "",
                confirm: "",
            });

            setShowCurrentPassword(false);

            setShowNewPassword(false);

            setShowConfirmPassword(false);

            setPasswordSuccess(
                t("profile.passwordChanged")
            );

            window.setTimeout(() => {
                setPasswordSuccess("");
            }, 4000);
        } catch (error) {
            console.error(
                "Password change error:",
                error
            );

            setError(
                getFirstValidationError(error) ||
                    error.response?.data?.message ||
                    t(
                        "profile.unableToChangePassword"
                    )
            );
        } finally {
            setChangingPassword(false);
        }
    };

    const initials = profile.fullName
        ? profile.fullName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((name) => name[0])
              .join("")
              .toUpperCase()
        : "P";

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-section">
                    <p>
                        {t("profile.loading")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* PAGE HEADING */}

            <div className="page-heading">
                {!isEditing ? (
                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={() => {
                            setIsEditing(true);
                            setSaved(false);
                            setError("");
                        }}
                    >
                        <FiEdit3 />

                        {t(
                            "profile.editProfile"
                        )}
                    </button>
                ) : (
                    <div className="profile-action-buttons">
                        <button
                            type="button"
                            className="profile-cancel-button"
                            onClick={
                                handleCancel
                            }
                            disabled={saving}
                        >
                            <FiX />

                            {t(
                                "profile.cancel"
                            )}
                        </button>

                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <FiSave />

                            {saving
                                ? t(
                                      "profile.saving"
                                  )
                                : t(
                                      "profile.saveChanges"
                                  )}
                        </button>
                    </div>
                )}
            </div>

            {/* ERROR MESSAGE */}

            {error && (
                <div className="profile-error-message">
                    {error}
                </div>
            )}

            {/* PROFILE SUCCESS */}

            {saved && (
                <div className="profile-success-message">
                    ✓{" "}
                    {t(
                        "profile.profileUpdated"
                    )}
                </div>
            )}

            {/* PASSWORD SUCCESS */}

            {passwordSuccess && (
                <div className="profile-success-message">
                    ✓ {passwordSuccess}
                </div>
            )}

            {/* PROFILE HEADER */}

            <section className="profile-header-card">
                <div className="profile-avatar">
                    {initials}
                </div>

                <div className="profile-header-info">
                    <h3>
                        {profile.fullName ||
                            t("profile.patient")}
                    </h3>

                    <p>
                        {profile.email ||
                            t("profile.noEmail")}
                    </p>

                    <span className="profile-patient-badge">
                        {t("profile.patient")}
                    </span>
                </div>
            </section>

            {/* PERSONAL INFORMATION */}

            <section className="profile-section">
                <div className="profile-section-header">
                    <div className="profile-section-icon">
                        <FiUser />
                    </div>

                    <div>
                        <h3>
                            {t(
                                "profile.personalInformation"
                            )}
                        </h3>

                        <p>
                            {t(
                                "profile.personalInformationDescription"
                            )}
                        </p>
                    </div>
                </div>

                <div className="profile-form-grid">
                    {/* FULL NAME */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.fullName"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiUser />

                            <input
                                type="text"
                                value={
                                    profile.fullName
                                }
                                disabled
                                readOnly
                            />
                        </div>
                    </div>

                    {/* EMAIL */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.emailAddress"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiMail />

                            <input
                                type="email"
                                value={
                                    profile.email
                                }
                                disabled
                                readOnly
                            />
                        </div>
                    </div>

                    {/* PHONE */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.phoneNumber"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiPhone />

                            <input
                                type="text"
                                value={
                                    profile.phone
                                }
                                disabled={
                                    !isEditing
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "phone",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* DATE OF BIRTH */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.dateOfBirth"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiCalendar />

                            <input
                                type="date"
                                value={
                                    profile.dateOfBirth
                                }
                                disabled={
                                    !isEditing
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "dateOfBirth",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* GENDER */}

                    <div className="profile-field">
                        <label>
                            {t("profile.gender")}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiUser />

                            <select
                                value={
                                    profile.gender ||
                                    ""
                                }
                                disabled={
                                    !isEditing
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "gender",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {t(
                                        "profile.selectGender"
                                    )}
                                </option>

                                <option value="male">
                                    {t(
                                        "profile.male"
                                    )}
                                </option>

                                <option value="female">
                                    {t(
                                        "profile.female"
                                    )}
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ADDRESS */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.address"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiMapPin />

                            <input
                                type="text"
                                value={
                                    profile.address
                                }
                                disabled={
                                    !isEditing
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "address",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CHANGE PASSWORD */}

            <section className="profile-section">
                <div className="profile-section-header">
                    <div className="profile-section-icon">
                        <FiLock />
                    </div>

                    <div>
                        <h3>
                            {t(
                                "profile.changePassword"
                            )}
                        </h3>

                        <p>
                            {t(
                                "profile.changePasswordDescription"
                            )}
                        </p>
                    </div>
                </div>

                <div className="profile-password-grid">
                    {/* CURRENT PASSWORD */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.currentPassword"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiLock />

                            <input
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                name="currentPasswordInput"
                                placeholder={t(
                                    "profile.enterCurrentPassword"
                                )}
                                value={
                                    passwords.current
                                }
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "current",
                                        e.target.value
                                    )
                                }
                                autoComplete="off"
                            />

                            <button
                                type="button"
                                className="profile-password-toggle"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label={
                                    showCurrentPassword
                                        ? t(
                                              "profile.hideCurrentPassword"
                                          )
                                        : t(
                                              "profile.showCurrentPassword"
                                          )
                                }
                            >
                                {showCurrentPassword ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* NEW PASSWORD */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.newPassword"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiLock />

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                name="newPasswordInput"
                                placeholder={t(
                                    "profile.enterNewPassword"
                                )}
                                value={
                                    passwords.newPassword
                                }
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="profile-password-toggle"
                                onClick={() =>
                                    setShowNewPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label={
                                    showNewPassword
                                        ? t(
                                              "profile.hideNewPassword"
                                          )
                                        : t(
                                              "profile.showNewPassword"
                                          )
                                }
                            >
                                {showNewPassword ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="profile-field">
                        <label>
                            {t(
                                "profile.confirmNewPassword"
                            )}
                        </label>

                        <div className="profile-input-wrapper">
                            <FiLock />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPasswordInput"
                                placeholder={t(
                                    "profile.confirmNewPasswordPlaceholder"
                                )}
                                value={
                                    passwords.confirm
                                }
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "confirm",
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="profile-password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? t(
                                              "profile.hideConfirmPassword"
                                          )
                                        : t(
                                              "profile.showConfirmPassword"
                                          )
                                }
                            >
                                {showConfirmPassword ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="profile-password-button"
                    onClick={
                        handleUpdatePassword
                    }
                    disabled={
                        changingPassword
                    }
                >
                    <FiLock />

                    {changingPassword
                        ? t(
                              "profile.updating"
                          )
                        : t(
                              "profile.updatePassword"
                          )}
                </button>
            </section>

            {/* NOTIFICATION SETTINGS */}

            <section className="profile-section">
                <div className="profile-section-header">
                    <div className="profile-section-icon">
                        <FiBell />
                    </div>

                    <div>
                        <h3>
                            {t(
                                "profile.notificationSettings"
                            )}
                        </h3>

                        <p>
                            {t(
                                "profile.notificationSettingsDescription"
                            )}
                        </p>
                    </div>
                </div>

                <div className="profile-settings">
                    {/* EMAIL NOTIFICATIONS */}

                    <div className="profile-setting-item">
                        <div>
                            <strong>
                                {t(
                                    "profile.emailNotifications"
                                )}
                            </strong>

                            <span>
                                {t(
                                    "profile.emailNotificationsDescription"
                                )}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`profile-switch ${
                                settings.emailNotifications
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setSettings(
                                    (prev) => ({
                                        ...prev,

                                        emailNotifications:
                                            !prev.emailNotifications,
                                    })
                                )
                            }
                            aria-label={t(
                                "profile.toggleEmailNotifications"
                            )}
                            aria-pressed={
                                settings.emailNotifications
                            }
                        >
                            <span />
                        </button>
                    </div>

                    {/* APPOINTMENT REMINDERS */}

                    <div className="profile-setting-item">
                        <div>
                            <strong>
                                {t(
                                    "profile.appointmentReminders"
                                )}
                            </strong>

                            <span>
                                {t(
                                    "profile.appointmentRemindersDescription"
                                )}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`profile-switch ${
                                settings.appointmentReminders
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setSettings(
                                    (prev) => ({
                                        ...prev,

                                        appointmentReminders:
                                            !prev.appointmentReminders,
                                    })
                                )
                            }
                            aria-label={t(
                                "profile.toggleAppointmentReminders"
                            )}
                            aria-pressed={
                                settings.appointmentReminders
                            }
                        >
                            <span />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profile;