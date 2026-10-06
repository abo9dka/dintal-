import { useEffect, useMemo, useState } from "react";

import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiPlus,
    FiRefreshCw,
    FiTrash2,
    FiX,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
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

const EMPTY_FORM = {
    day_of_week: "",
    start_time: "09:00",
    end_time: "17:00",
    is_active: true,
};

function DoctorWorkingHours() {
    const { t } = useLanguage();

    const [workingHours, setWorkingHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingHour, setEditingHour] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        loadWorkingHours();
    }, []);

    const loadWorkingHours = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await doctorService.getWorkingHours();

            const list = Array.isArray(data)
                ? data
                : data?.working_hours ||
                  data?.data ||
                  [];

            setWorkingHours(
                Array.isArray(list) ? list : []
            );
        } catch (err) {
            console.error(
                "Failed to load working hours:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("workingHours.loadFailed")
            );
        } finally {
            setLoading(false);
        }
    };

    const sortedWorkingHours = useMemo(() => {
        return [...workingHours].sort((a, b) => {
            const aIndex = DAYS.findIndex(
                (day) =>
                    day.value ===
                    String(a.day_of_week).toLowerCase()
            );

            const bIndex = DAYS.findIndex(
                (day) =>
                    day.value ===
                    String(b.day_of_week).toLowerCase()
            );

            return aIndex - bIndex;
        });
    }, [workingHours]);

    const activeHours = useMemo(() => {
        return workingHours.filter(
            (hour) =>
                hour.is_active === true ||
                hour.is_active === 1 ||
                hour.is_active === "1"
        );
    }, [workingHours]);

    const timeToMinutes = (time) => {
        if (!time) {
            return 0;
        }

        const [hours, minutes] = String(time)
            .slice(0, 5)
            .split(":")
            .map(Number);

        return hours * 60 + minutes;
    };

    const totalWeeklyHours = useMemo(() => {
        return activeHours.reduce((total, hour) => {
            const start = timeToMinutes(
                hour.start_time
            );

            const end = timeToMinutes(
                hour.end_time
            );

            if (end <= start) {
                return total;
            }

            return total + (end - start) / 60;
        }, 0);
    }, [activeHours]);

    const getDayLabel = (day) => {
        const found = DAYS.find(
            (item) =>
                item.value ===
                String(day || "").toLowerCase()
        );

        return found
            ? t(`workingHours.days.${found.key}`)
            : t("workingHours.unknownDay");
    };

    const normalizeTime = (time) => {
        if (!time) {
            return "";
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

    const formatDuration = (hour) => {
        const start = timeToMinutes(
            hour.start_time
        );

        const end = timeToMinutes(
            hour.end_time
        );

        const difference = end - start;

        if (difference <= 0) {
            return t("workingHours.invalidTime");
        }

        const hours = Math.floor(
            difference / 60
        );

        const minutes = difference % 60;

        if (minutes === 0) {
            return `${hours}${t(
                "workingHours.hoursShort"
            )}`;
        }

        return `${hours}${t(
            "workingHours.hoursShort"
        )} ${minutes}${t(
            "workingHours.minutesShort"
        )}`;
    };

    const clearMessages = () => {
        setError("");
        setFormError("");
        setSuccess("");
    };

    const handleOpenCreate = () => {
        clearMessages();

        setEditingHour(null);

        setForm({
            ...EMPTY_FORM,

            day_of_week:
                DAYS.find(
                    (day) =>
                        !workingHours.some(
                            (hour) =>
                                String(
                                    hour.day_of_week
                                ).toLowerCase() ===
                                day.value
                        )
                )?.value || "",
        });

        setShowForm(true);
    };

    const handleOpenEdit = (hour) => {
        clearMessages();

        setEditingHour(hour);

        setForm({
            day_of_week:
                String(
                    hour.day_of_week || ""
                ).toLowerCase(),

            start_time: normalizeTime(
                hour.start_time
            ),

            end_time: normalizeTime(
                hour.end_time
            ),

            is_active: isActive(hour),
        });

        setShowForm(true);
    };

    const handleCloseForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingHour(null);
        setFormError("");
    };

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const validateForm = () => {
        if (!form.day_of_week) {
            return t(
                "workingHours.validation.day"
            );
        }

        if (
            !form.start_time ||
            !form.end_time
        ) {
            return t(
                "workingHours.validation.bothTimes"
            );
        }

        if (
            timeToMinutes(form.end_time) <=
            timeToMinutes(form.start_time)
        ) {
            return t(
                "workingHours.validation.endAfterStart"
            );
        }

        const duplicate =
            workingHours.find(
                (hour) =>
                    String(
                        hour.day_of_week
                    ).toLowerCase() ===
                        form.day_of_week &&
                    hour.id !== editingHour?.id
            );

        if (duplicate) {
            return t(
                "workingHours.validation.duplicate"
            );
        }

        return "";
    };

    const getApiError = (err) => {
        const responseData =
            err.response?.data;

        if (responseData?.errors) {
            const firstError =
                Object.values(
                    responseData.errors
                )[0];

            if (Array.isArray(firstError)) {
                return firstError[0];
            }

            if (
                typeof firstError ===
                "string"
            ) {
                return firstError;
            }
        }

        return (
            responseData?.message ||
            t("workingHours.genericError")
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        try {
            setSaving(true);

            const payload = {
                day_of_week:
                    form.day_of_week,

                start_time:
                    form.start_time,

                end_time:
                    form.end_time,

                is_active:
                    form.is_active,
            };

            if (editingHour) {
                await doctorService.updateWorkingHour(
                    editingHour.id,
                    payload
                );

                setSuccess(
                    t(
                        "workingHours.updatedSuccessfully"
                    )
                );
            } else {
                await doctorService.addWorkingHour(
                    payload
                );

                setSuccess(
                    t(
                        "workingHours.addedSuccessfully"
                    )
                );
            }

            setShowForm(false);
            setEditingHour(null);
            setForm(EMPTY_FORM);

            await loadWorkingHours();
        } catch (err) {
            console.error(
                "Failed to save working hours:",
                err
            );

            setFormError(
                getApiError(err)
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (hour) => {
        const confirmed =
            window.confirm(
                t(
                    "workingHours.deleteConfirm",
                    {
                        day: getDayLabel(
                            hour.day_of_week
                        ),
                    }
                )
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(hour.id);
            setError("");
            setSuccess("");

            await doctorService.deleteWorkingHour(
                hour.id
            );

            setSuccess(
                t(
                    "workingHours.deletedSuccessfully"
                )
            );

            await loadWorkingHours();
        } catch (err) {
            console.error(
                "Failed to delete working hours:",
                err
            );

            setError(getApiError(err));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="doctor-working-hours-page">
            {/* Header */}
            <div className="doctor-working-hours-header">
                <div>
                    <div className="doctor-working-hours-title-row">
                        <div className="doctor-working-hours-title-icon">
                            <FiClock />
                        </div>

                        <div>
                            <h1>
                                {t(
                                    "workingHours.title"
                                )}
                            </h1>

                            <p>
                                {t(
                                    "workingHours.description"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="doctor-working-hours-header-actions">
                    <button
                        type="button"
                        className="doctor-working-hours-refresh"
                        onClick={
                            loadWorkingHours
                        }
                        disabled={loading}
                    >
                        <FiRefreshCw
                            className={
                                loading
                                    ? "doctor-spin"
                                    : ""
                            }
                        />

                        <span>
                            {t(
                                "workingHours.refresh"
                            )}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="doctor-working-hours-add"
                        onClick={
                            handleOpenCreate
                        }
                    >
                        <FiPlus />

                        <span>
                            {t(
                                "workingHours.addWorkingHours"
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Success */}
            {success && (
                <div className="doctor-working-hours-alert success">
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

            {/* Error */}
            {error && (
                <div className="doctor-working-hours-alert error">
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

            {/* Summary */}
            <div className="doctor-working-hours-summary">
                <div className="doctor-working-hours-summary-card">
                    <div className="doctor-working-hours-summary-icon blue">
                        <FiCalendar />
                    </div>

                    <div>
                        <span>
                            {t(
                                "workingHours.configuredDays"
                            )}
                        </span>

                        <strong>
                            {workingHours.length}
                        </strong>
                    </div>
                </div>

                <div className="doctor-working-hours-summary-card">
                    <div className="doctor-working-hours-summary-icon green">
                        <FiCheckCircle />
                    </div>

                    <div>
                        <span>
                            {t(
                                "workingHours.activeDays"
                            )}
                        </span>

                        <strong>
                            {activeHours.length}
                        </strong>
                    </div>
                </div>

                <div className="doctor-working-hours-summary-card">
                    <div className="doctor-working-hours-summary-icon purple">
                        <FiClock />
                    </div>

                    <div>
                        <span>
                            {t(
                                "workingHours.weeklyHours"
                            )}
                        </span>

                        <strong>
                            {Number.isInteger(
                                totalWeeklyHours
                            )
                                ? totalWeeklyHours
                                : totalWeeklyHours.toFixed(
                                      1
                                  )}

                            {t(
                                "workingHours.hoursShort"
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <section className="doctor-working-hours-section">
                <div className="doctor-working-hours-section-header">
                    <div>
                        <h2>
                            {t(
                                "workingHours.weeklySchedule"
                            )}
                        </h2>

                        <p>
                            {t(
                                "workingHours.scheduleDescription"
                            )}
                        </p>
                    </div>

                    <span className="doctor-working-hours-count">
                        {workingHours.length}{" "}
                        {workingHours.length ===
                        1
                            ? t(
                                  "workingHours.day"
                              )
                            : t(
                                  "workingHours.daysCount"
                              )}
                    </span>
                </div>

                {loading ? (
                    <div className="doctor-working-hours-loading">
                        <div className="doctor-working-hours-spinner"></div>

                        <p>
                            {t(
                                "workingHours.loading"
                            )}
                        </p>
                    </div>
                ) : sortedWorkingHours.length ===
                  0 ? (
                    <div className="doctor-working-hours-empty">
                        <div className="doctor-working-hours-empty-icon">
                            <FiClock />
                        </div>

                        <h3>
                            {t(
                                "workingHours.noWorkingHours"
                            )}
                        </h3>

                        <p>
                            {t(
                                "workingHours.noWorkingHoursDescription"
                            )}
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleOpenCreate
                            }
                        >
                            <FiPlus />

                            {t(
                                "workingHours.addWorkingHours"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="doctor-working-hours-grid">
                        {sortedWorkingHours.map(
                            (hour) => (
                                <article
                                    key={
                                        hour.id
                                    }
                                    className={`doctor-working-hour-card ${
                                        isActive(
                                            hour
                                        )
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <div className="doctor-working-hour-card-top">
                                        <div className="doctor-working-hour-day">
                                            <div className="doctor-working-hour-day-icon">
                                                <FiCalendar />
                                            </div>

                                            <div>
                                                <h3>
                                                    {getDayLabel(
                                                        hour.day_of_week
                                                    )}
                                                </h3>

                                                <span>
                                                    {t(
                                                        "workingHours.weeklySchedule"
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`doctor-working-hour-status ${
                                                isActive(
                                                    hour
                                                )
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {isActive(
                                                hour
                                            )
                                                ? t(
                                                      "workingHours.active"
                                                  )
                                                : t(
                                                      "workingHours.inactive"
                                                  )}
                                        </span>
                                    </div>

                                    <div className="doctor-working-hour-time">
                                        <div>
                                            <span>
                                                {t(
                                                    "workingHours.start"
                                                )}
                                            </span>

                                            <strong>
                                                {normalizeTime(
                                                    hour.start_time
                                                )}
                                            </strong>
                                        </div>

                                        <div className="doctor-working-hour-arrow">
                                            →
                                        </div>

                                        <div>
                                            <span>
                                                {t(
                                                    "workingHours.end"
                                                )}
                                            </span>

                                            <strong>
                                                {normalizeTime(
                                                    hour.end_time
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="doctor-working-hour-duration">
                                        <FiClock />

                                        <span>
                                            {formatDuration(
                                                hour
                                            )}
                                        </span>
                                    </div>

                                    <div className="doctor-working-hour-actions">
                                        <button
                                            type="button"
                                            className="edit"
                                            onClick={() =>
                                                handleOpenEdit(
                                                    hour
                                                )
                                            }
                                        >
                                            <FiEdit3 />

                                            <span>
                                                {t(
                                                    "workingHours.edit"
                                                )}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className="delete"
                                            onClick={() =>
                                                handleDelete(
                                                    hour
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                hour.id
                                            }
                                        >
                                            <FiTrash2 />

                                            <span>
                                                {deletingId ===
                                                hour.id
                                                    ? t(
                                                          "workingHours.deleting"
                                                      )
                                                    : t(
                                                          "workingHours.delete"
                                                      )}
                                            </span>
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* Modal */}
            {showForm && (
                <div
                    className="doctor-working-hours-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseForm();
                        }
                    }}
                >
                    <div className="doctor-working-hours-modal">
                        <div className="doctor-working-hours-modal-header">
                            <div>
                                <h2>
                                    {editingHour
                                        ? t(
                                              "workingHours.editWorkingHours"
                                          )
                                        : t(
                                              "workingHours.addWorkingHours"
                                          )}
                                </h2>

                                <p>
                                    {t(
                                        "workingHours.setAvailability"
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseForm
                                }
                                disabled={saving}
                            >
                                <FiX />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="doctor-working-hours-form"
                        >
                            {formError && (
                                <div className="doctor-working-hours-form-error">
                                    {formError}
                                </div>
                            )}

                            <div className="doctor-working-hours-form-group">
                                <label htmlFor="day_of_week">
                                    {t(
                                        "workingHours.day"
                                    )}
                                </label>

                                <div className="doctor-working-hours-input-wrapper">
                                    <FiCalendar />

                                    <select
                                        id="day_of_week"
                                        name="day_of_week"
                                        value={
                                            form.day_of_week
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        <option value="">
                                            {t(
                                                "workingHours.selectDay"
                                            )}
                                        </option>

                                        {DAYS.map(
                                            (
                                                day
                                            ) => (
                                                <option
                                                    key={
                                                        day.value
                                                    }
                                                    value={
                                                        day.value
                                                    }
                                                >
                                                    {t(
                                                        `workingHours.days.${day.key}`
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="doctor-working-hours-time-grid">
                                <div className="doctor-working-hours-form-group">
                                    <label htmlFor="start_time">
                                        {t(
                                            "workingHours.startTime"
                                        )}
                                    </label>

                                    <div className="doctor-working-hours-input-wrapper">
                                        <FiClock />

                                        <input
                                            id="start_time"
                                            type="time"
                                            name="start_time"
                                            value={
                                                form.start_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="doctor-working-hours-form-group">
                                    <label htmlFor="end_time">
                                        {t(
                                            "workingHours.endTime"
                                        )}
                                    </label>

                                    <div className="doctor-working-hours-input-wrapper">
                                        <FiClock />

                                        <input
                                            id="end_time"
                                            type="time"
                                            name="end_time"
                                            value={
                                                form.end_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className="doctor-working-hours-toggle">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                />

                                <span className="doctor-working-hours-toggle-track">
                                    <span></span>
                                </span>

                                <span className="doctor-working-hours-toggle-content">
                                    <strong>
                                        {t(
                                            "workingHours.activeWorkingHours"
                                        )}
                                    </strong>

                                    <small>
                                        {t(
                                            "workingHours.activeWorkingHoursDescription"
                                        )}
                                    </small>
                                </span>
                            </label>

                            <div className="doctor-working-hours-form-actions">
                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={
                                        handleCloseForm
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    {t(
                                        "workingHours.cancel"
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    className="save"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving ? (
                                        <>
                                            <span className="doctor-working-hours-button-spinner"></span>

                                            {t(
                                                "workingHours.saving"
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle />

                                            {editingHour
                                                ? t(
                                                      "workingHours.saveChanges"
                                                  )
                                                : t(
                                                      "workingHours.addWorkingHours"
                                                  )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorWorkingHours;
