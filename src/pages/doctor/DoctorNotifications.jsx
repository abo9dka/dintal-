import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiRefreshCw,
    FiAlertCircle,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorNotifications() {
    const { t, language } = useLanguage();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [markingAll, setMarkingAll] = useState(false);

    const normalizeNotifications = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        return [];
    };

    const loadNotifications = useCallback(
        async (showRefresh = false) => {
            try {
                setError("");

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response =
                    await doctorService.getNotifications();

                const data =
                    normalizeNotifications(response);

                setNotifications(data);
            } catch (err) {
                console.error(
                    "Failed to load notifications:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        t("notifications.failed")
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [t]
    );

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const isRead = (notification) => {
        if (
            typeof notification.is_read === "boolean"
        ) {
            return notification.is_read;
        }

        return Boolean(notification.read_at);
    };

    const unreadCount = useMemo(() => {
        return notifications.filter(
            (notification) => !isRead(notification)
        ).length;
    }, [notifications]);

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleString(
            language === "ar" ? "ar-SA" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const handleMarkAsRead = async (notification) => {
        if (
            isRead(notification) ||
            processingId === notification.id
        ) {
            return;
        }

        try {
            setProcessingId(notification.id);

            await doctorService.markNotificationAsRead(
                notification.id
            );

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                              ...item,
                              read_at:
                                  item.read_at ||
                                  new Date().toISOString(),
                              is_read: true,
                          }
                        : item
                )
            );
        } catch (err) {
            console.error(
                "Failed to mark notification as read:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("notifications.markReadFailed")
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0 || markingAll) {
            return;
        }

        try {
            setMarkingAll(true);
            setError("");

            await doctorService.markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read_at:
                        notification.read_at ||
                        new Date().toISOString(),
                    is_read: true,
                }))
            );
        } catch (err) {
            console.error(
                "Failed to mark all notifications as read:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("notifications.markAllFailed")
            );
        } finally {
            setMarkingAll(false);
        }
    };

    const getNotificationIcon = (notification) => {
        const title =
            notification.title?.toLowerCase() || "";

        if (
            title.includes("appointment") ||
            title.includes("موعد")
        ) {
            return <FiClock />;
        }

        return <FiBell />;
    };

    if (loading) {
        return (
            <section className="doctor-notifications-page">
                <div className="doctor-notifications-loading">
                    <div className="doctor-notifications-spinner"></div>

                    <p>
                        {t("notifications.loading")}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="doctor-notifications-page">
            {/* HEADER */}
            <div className="doctor-notifications-header">
                <div>
                    <div className="doctor-notifications-title-row">
                        <div className="doctor-notifications-title-icon">
                            <FiBell />
                        </div>

                        <div>
                            <h1>
                                {t("notifications.title")}
                            </h1>

                            <p>
                                {t(
                                    "notifications.description"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="doctor-notifications-header-actions">
                    <button
                        type="button"
                        className="doctor-notifications-refresh"
                        onClick={() =>
                            loadNotifications(true)
                        }
                        disabled={refreshing}
                    >
                        <FiRefreshCw
                            className={
                                refreshing
                                    ? "doctor-notifications-spin"
                                    : ""
                            }
                        />

                        <span>
                            {refreshing
                                ? t(
                                      "notifications.refreshing"
                                  )
                                : t(
                                      "notifications.refresh"
                                  )}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="doctor-notifications-mark-all"
                        onClick={handleMarkAllAsRead}
                        disabled={
                            unreadCount === 0 ||
                            markingAll
                        }
                    >
                        <FiCheckCircle />

                        <span>
                            {markingAll
                                ? t(
                                      "notifications.marking"
                                  )
                                : t(
                                      "notifications.markAllAsRead"
                                  )}
                        </span>
                    </button>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="doctor-notifications-summary">
                <div className="doctor-notifications-summary-card">
                    <div className="doctor-notifications-summary-icon total">
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

                <div className="doctor-notifications-summary-card">
                    <div className="doctor-notifications-summary-icon unread">
                        <FiAlertCircle />
                    </div>

                    <div>
                        <span>
                            {t(
                                "notifications.unreadNotifications"
                            )}
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>
                    </div>
                </div>

                <div className="doctor-notifications-summary-card">
                    <div className="doctor-notifications-summary-icon read">
                        <FiCheckCircle />
                    </div>

                    <div>
                        <span>
                            {t(
                                "notifications.readNotifications"
                            )}
                        </span>

                        <strong>
                            {notifications.length -
                                unreadCount}
                        </strong>
                    </div>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="doctor-notifications-error">
                    <FiAlertCircle />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            loadNotifications()
                        }
                    >
                        {t("notifications.tryAgain")}
                    </button>
                </div>
            )}

            {/* CONTENT */}
            {notifications.length === 0 ? (
                <div className="doctor-notifications-empty">
                    <div className="doctor-notifications-empty-icon">
                        <FiBell />
                    </div>

                    <h2>
                        {t(
                            "notifications.noNotifications"
                        )}
                    </h2>

                    <p>
                        {t(
                            "notifications.noNotificationsDescription"
                        )}
                    </p>
                </div>
            ) : (
                <div className="doctor-notifications-list">
                    {notifications.map((notification) => {
                        const read =
                            isRead(notification);

                        return (
                            <article
                                key={notification.id}
                                className={`doctor-notification-card ${
                                    read
                                        ? "is-read"
                                        : "is-unread"
                                }`}
                                onClick={() =>
                                    handleMarkAsRead(
                                        notification
                                    )
                                }
                            >
                                <div className="doctor-notification-icon">
                                    {getNotificationIcon(
                                        notification
                                    )}
                                </div>

                                <div className="doctor-notification-content">
                                    <div className="doctor-notification-top">
                                        <div>
                                            <h3>
                                                {notification.title ||
                                                    t(
                                                        "notifications.notification"
                                                    )}
                                            </h3>

                                            {!read && (
                                                <span className="doctor-notification-unread-dot">
                                                    {t(
                                                        "notifications.new"
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        {!read && (
                                            <span className="doctor-notification-unread-label">
                                                {t(
                                                    "notifications.unread"
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <p>
                                        {notification.message ||
                                            t(
                                                "notifications.newNotification"
                                            )}
                                    </p>

                                    <div className="doctor-notification-footer">
                                        <span>
                                            <FiClock />

                                            {formatDate(
                                                notification.created_at
                                            )}
                                        </span>

                                        {!read && (
                                            <button
                                                type="button"
                                                className="doctor-notification-read-button"
                                                onClick={(
                                                    event
                                                ) => {
                                                    event.stopPropagation();

                                                    handleMarkAsRead(
                                                        notification
                                                    );
                                                }}
                                                disabled={
                                                    processingId ===
                                                    notification.id
                                                }
                                            >
                                                <FiCheck />

                                                {processingId ===
                                                notification.id
                                                    ? t(
                                                          "notifications.marking"
                                                      )
                                                    : t(
                                                          "notifications.markAsRead"
                                                      )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default DoctorNotifications;
