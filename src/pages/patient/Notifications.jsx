import {
    FiBell,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiFileText,
    FiTrash2,
    FiCheck,
    FiInfo,
} from "react-icons/fi";

import { useEffect, useState } from "react";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function Notifications() {
    const { t, language } = useLanguage();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [markingId, setMarkingId] = useState(null);
    const [error, setError] = useState("");

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        setError("");

        try {
            const data =
                await patientService.getNotifications();

            const notificationList = Array.isArray(data)
                ? data
                : data?.notifications || [];

            const normalizedNotifications =
                notificationList
                    .map((notification) => ({
                        ...notification,

                        read:
                            notification.read ??
                            notification.is_read ??
                            false,

                        title:
                            notification.title ||
                            t("notifications.notification"),

                        message:
                            notification.message ||
                            notification.body ||
                            "",

                        type:
                            notification.type ||
                            "info",

                        created_at:
                            notification.created_at ||
                            notification.date ||
                            null,
                    }))
                    .sort((a, b) => {
                        const dateA = a.created_at
                            ? new Date(
                                  a.created_at
                              ).getTime()
                            : 0;

                        const dateB = b.created_at
                            ? new Date(
                                  b.created_at
                              ).getTime()
                            : 0;

                        return dateB - dateA;
                    });

            setNotifications(
                normalizedNotifications
            );
        } catch (error) {
            console.error(
                "Notifications loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    t(
                        "notifications.unableToLoad"
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "appointment":
                return <FiCalendar />;

            case "treatment":
                return <FiCheckCircle />;

            case "record":
                return <FiFileText />;

            default:
                return <FiInfo />;
        }
    };

    const formatNotificationDate = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const markAsRead = async (id) => {
        if (
            !id ||
            markingId === id ||
            markingAll
        ) {
            return;
        }

        setMarkingId(id);
        setError("");

        try {
            await patientService.markNotificationAsRead(
                id
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? {
                              ...notification,
                              read: true,
                              is_read: true,
                          }
                        : notification
                )
            );
        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    t(
                        "notifications.unableToMarkRead"
                    )
            );
        } finally {
            setMarkingId(null);
        }
    };

    const markAllAsRead = async () => {
        if (
            unreadCount === 0 ||
            markingAll ||
            markingId !== null
        ) {
            return;
        }

        setMarkingAll(true);
        setError("");

        try {
            await patientService.markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    read: true,
                    is_read: true,
                }))
            );
        } catch (error) {
            console.error(
                "Mark all notifications as read error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    t(
                        "notifications.unableToMarkAllRead"
                    )
            );
        } finally {
            setMarkingAll(false);
        }
    };

    /*
     * There is currently no delete endpoint
     * in the backend.
     *
     * Therefore this removes the notification
     * from the current frontend state only.
     */
    const deleteNotification = (id) => {
        setNotifications((prev) =>
            prev.filter(
                (notification) =>
                    notification.id !== id
            )
        );
    };

    if (loading) {
        return (
            <div className="notifications-page">
                <div className="page-heading">
                    <div>
                        <h2>
                            {t(
                                "notifications.title"
                            )}
                        </h2>

                        <p>
                            {t(
                                "notifications.description"
                            )}
                        </p>
                    </div>
                </div>

                <section className="notifications-section">
                    <div className="notifications-empty">
                        <div className="notifications-empty-icon">
                            <FiBell />
                        </div>

                        <h3>
                            {t(
                                "notifications.loading"
                            )}
                        </h3>

                        <p>
                            {t(
                                "notifications.loadingDescription"
                            )}
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            {/* Heading */}
            <div className="page-heading">
                <div>
                    <h2>
                        {t("notifications.title")}
                    </h2>

                    <p>
                        {t(
                            "notifications.description"
                        )}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="notifications-mark-all"
                        onClick={markAllAsRead}
                        disabled={markingAll}
                    >
                        <FiCheck />

                        {markingAll
                            ? t(
                                  "notifications.marking"
                              )
                            : t(
                                  "notifications.markAllAsRead"
                              )}
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="profile-error-message">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className="notifications-summary">
                <div className="notifications-summary-card">
                    <div className="notifications-summary-icon">
                        <FiBell />
                    </div>

                    <div>
                        <span>
                            {t(
                                "notifications.totalNotifications"
                            )}
                        </span>

                        <strong>
                            {notifications.length}
                        </strong>
                    </div>
                </div>

                <div className="notifications-summary-card">
                    <div className="notifications-summary-icon unread">
                        <FiClock />
                    </div>

                    <div>
                        <span>
                            {t(
                                "notifications.unread"
                            )}
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <section className="notifications-section">
                <div className="section-title-row">
                    <div>
                        <h3 className="section-title">
                            {t(
                                "notifications.recentNotifications"
                            )}
                        </h3>

                        <p>
                            {t(
                                "notifications.recentDescription"
                            )}
                        </p>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="notifications-empty">
                        <div className="notifications-empty-icon">
                            <FiBell />
                        </div>

                        <h3>
                            {t(
                                "notifications.noNotifications"
                            )}
                        </h3>

                        <p>
                            {t(
                                "notifications.noNotificationsDescription"
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(
                            (
                                notification,
                                index
                            ) => (
                                <div
                                    key={
                                        notification.id ??
                                        `notification-${index}`
                                    }
                                    className={`notification-card ${
                                        notification.read
                                            ? "read"
                                            : "unread"
                                    }`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`notification-icon ${
                                            notification.type ||
                                            "info"
                                        }`}
                                    >
                                        {getNotificationIcon(
                                            notification.type
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <div>
                                                <h3>
                                                    {
                                                        notification.title
                                                    }
                                                </h3>

                                                {!notification.read && (
                                                    <span className="notification-new">
                                                        {t(
                                                            "notifications.new"
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="notification-date">
                                                {formatNotificationDate(
                                                    notification.created_at
                                                )}
                                            </span>
                                        </div>

                                        <p>
                                            {
                                                notification.message
                                            }
                                        </p>

                                        <div className="notification-actions">
                                            {!notification.read && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    disabled={
                                                        markingId ===
                                                            notification.id ||
                                                        markingAll
                                                    }
                                                >
                                                    <FiCheck />

                                                    {markingId ===
                                                    notification.id
                                                        ? t(
                                                              "notifications.marking"
                                                          )
                                                        : t(
                                                              "notifications.markAsRead"
                                                          )}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="delete-notification"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                            >
                                                <FiTrash2 />

                                                {t(
                                                    "notifications.delete"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Notifications;