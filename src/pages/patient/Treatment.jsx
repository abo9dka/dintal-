import { useEffect, useMemo, useState } from "react";

import {
    FiActivity,
    FiCalendar,
    FiCheck,
    FiClock,
    FiFileText,
    FiUser,
    FiRefreshCw,
} from "react-icons/fi";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function Treatment() {
    const { t, language } = useLanguage();

    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTreatmentData();
    }, []);

    const loadTreatmentData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                appointmentsData,
                recordsData,
            ] = await Promise.all([
                patientService.getAppointments(),
                patientService.getMedicalRecords(),
            ]);

            const appointmentsList =
                Array.isArray(appointmentsData)
                    ? appointmentsData
                    : appointmentsData?.appointments || [];

            const recordsList =
                Array.isArray(recordsData)
                    ? recordsData
                    : recordsData?.records || [];

            setAppointments(appointmentsList);
            setMedicalRecords(recordsList);
        } catch (error) {
            console.error(
                "Failed to load treatment data:",
                error
            );

            setError(
                language === "ar"
                    ? "تعذر تحميل معلومات العلاج."
                    : "Unable to load your treatment information."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "--";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            language === "ar"
                ? "ar"
                : "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const formatType = (type) => {
        if (!type) {
            return language === "ar"
                ? "موعد أسنان"
                : "Dental Appointment";
        }

        return type
            .replace(/\_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const getDoctorName = (item) => {
        return (
            item?.doctor?.user?.name ||
            item?.doctor?.name ||
            (language === "ar"
                ? "الطبيب"
                : "Doctor")
        );
    };

    const getDoctorSpecialization = (item) => {
        return (
            item?.doctor?.specialization ||
            ""
        );
    };

    const treatmentData = useMemo(() => {
        const allDates = [
            ...appointments.map(
                (appointment) =>
                    appointment.appointment_date
            ),

            ...medicalRecords.map(
                (record) =>
                    record.created_at ||
                    record.updated_at
            ),
        ]
            .filter(Boolean)
            .map((date) => new Date(date))
            .filter(
                (date) =>
                    !Number.isNaN(
                        date.getTime()
                    )
            )
            .sort((a, b) => a - b);

        const startDate =
            allDates.length > 0
                ? allDates[0]
                : null;

        const completedAppointments =
            appointments.filter(
                (appointment) =>
                    appointment.status?.toLowerCase() ===
                    "completed"
            );

        const activeAppointments =
            appointments.filter(
                (appointment) =>
                    appointment.status?.toLowerCase() !==
                        "cancelled" &&
                    appointment.status?.toLowerCase() !==
                        "completed"
            );

        const latestRecord =
            medicalRecords.length > 0
                ? [...medicalRecords].sort(
                      (a, b) =>
                          new Date(
                              b.created_at ||
                                  b.updated_at ||
                                  0
                          ) -
                          new Date(
                              a.created_at ||
                                  a.updated_at ||
                                  0
                          )
                  )[0]
                : null;

        const latestAppointment =
            appointments.length > 0
                ? [...appointments].sort(
                      (a, b) =>
                          new Date(
                              b.appointment_date ||
                                  0
                          ) -
                          new Date(
                              a.appointment_date ||
                                  0
                          )
                  )[0]
                : null;

        const doctorSource =
            latestRecord ||
            latestAppointment;

        const doctor = doctorSource
            ? getDoctorName(doctorSource)
            : language === "ar"
              ? "غير محدد"
              : "Not assigned";

        const specialization =
            doctorSource
                ? getDoctorSpecialization(
                      doctorSource
                  )
                : "";

        const treatmentName =
            latestRecord?.treatment ||
            latestRecord?.diagnosis ||
            (latestAppointment
                ? formatType(
                      latestAppointment.type
                  )
                : language === "ar"
                  ? "لا يوجد علاج حالي"
                  : "No active treatment");

        let progress = 0;

        if (
            completedAppointments.length > 0 ||
            medicalRecords.length > 0
        ) {
            const total =
                completedAppointments.length +
                medicalRecords.length;

            const completed =
                completedAppointments.length;

            progress =
                total > 0
                    ? Math.round(
                          (completed /
                              total) *
                              100
                      )
                    : 0;
        }

        return {
            treatmentName,
            doctor,
            specialization,
            startDate,
            progress,
            completedAppointments,
            activeAppointments,
            latestRecord,
            latestAppointment,
        };
    }, [
        appointments,
        medicalRecords,
        language,
    ]);

    const timeline = useMemo(() => {
        const items = [];

        medicalRecords.forEach((record) => {
            items.push({
                id: `record-${record.id}`,

                title:
                    record.treatment ||
                    record.diagnosis ||
                    (language === "ar"
                        ? "السجل الطبي"
                        : "Medical Record"),

                description:
                    record.notes ||
                    record.treatment ||
                    record.diagnosis ||
                    (language === "ar"
                        ? "تم تحديث السجل الطبي."
                        : "Medical record updated."),

                date:
                    record.created_at ||
                    record.updated_at,

                status: "completed",
            });
        });

        appointments.forEach((appointment) => {
            let status = "upcoming";

            const appointmentStatus =
                appointment.status?.toLowerCase();

            if (
                appointmentStatus ===
                "completed"
            ) {
                status = "completed";
            } else if (
                appointmentStatus ===
                    "confirmed" ||
                appointmentStatus ===
                    "pending"
            ) {
                status = "current";
            }

            if (
                appointmentStatus !==
                "cancelled"
            ) {
                items.push({
                    id: `appointment-${appointment.id}`,

                    title: formatType(
                        appointment.type
                    ),

                    description:
                        appointment.reason ||
                        (language === "ar"
                            ? `موعد مع ${getDoctorName(
                                  appointment
                              )}.`
                            : `Appointment with ${getDoctorName(
                                  appointment
                              )}.`),

                    date:
                        appointment.appointment_date,

                    status,
                });
            }
        });

        return items
            .sort(
                (a, b) =>
                    new Date(a.date || 0) -
                    new Date(b.date || 0)
            )
            .slice(-8);
    }, [
        appointments,
        medicalRecords,
        language,
    ]);

    const getTimelineStatusLabel = (
        status
    ) => {
        if (status === "completed") {
            return t(
                "treatment.completed"
            );
        }

        if (status === "current") {
            return t(
                "treatment.inProgress"
            );
        }

        return t(
            "treatment.upcoming"
        );
    };

    if (loading) {
        return (
            <div className="treatment-page">
                <div className="page-heading">
                    <div>
                        <h2>
                            {t(
                                "treatment.title"
                            )}
                        </h2>

                        <p>
                            {t(
                                "treatment.description"
                            )}
                        </p>
                    </div>
                </div>

                <div className="treatment-main-card">
                    <div className="treatment-card-header">
                        <div className="treatment-icon">
                            <FiActivity />
                        </div>

                        <div>
                            <span className="treatment-label">
                                {t(
                                    "treatment.label"
                                )}
                            </span>

                            <h3>
                                {t(
                                    "treatment.loading"
                                )}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="treatment-page">
            {/* PAGE HEADER */}

            <div className="page-heading">
                <div>
                    <h2>
                        {t(
                            "treatment.title"
                        )}
                    </h2>

                    <p>
                        {t(
                            "treatment.description"
                        )}
                    </p>
                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="error-text">
                    {error}

                    <button
                        type="button"
                        onClick={
                            loadTreatmentData
                        }
                    >
                        <FiRefreshCw />

                        {t(
                            "treatment.retry"
                        )}
                    </button>
                </div>
            )}

            {/* NO DATA */}

            {!error &&
                appointments.length === 0 &&
                medicalRecords.length === 0 && (
                    <section className="treatment-overview">
                        <div className="treatment-main-card">
                            <div className="treatment-card-header">
                                <div className="treatment-icon">
                                    <FiActivity />
                                </div>

                                <div>
                                    <span className="treatment-label">
                                        {t(
                                            "treatment.label"
                                        )}
                                    </span>

                                    <h3>
                                        {t(
                                            "treatment.noInformation"
                                        )}
                                    </h3>
                                </div>
                            </div>

                            <p>
                                {t(
                                    "treatment.noInformationDescription"
                                )}
                            </p>
                        </div>
                    </section>
                )}

            {/* CURRENT TREATMENT */}

            {(appointments.length > 0 ||
                medicalRecords.length > 0) && (
                <>
                    <section className="treatment-overview">
                        <div className="treatment-main-card">
                            <div className="treatment-card-header">
                                <div className="treatment-icon">
                                    <FiActivity />
                                </div>

                                <div>
                                    <span className="treatment-label">
                                        {t(
                                            "treatment.currentTreatment"
                                        )}
                                    </span>

                                    <h3>
                                        {
                                            treatmentData.treatmentName
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="treatment-info-grid">
                                {/* DOCTOR */}

                                <div className="treatment-info-item">
                                    <FiUser />

                                    <div>
                                        <span>
                                            {t(
                                                "treatment.doctor"
                                            )}
                                        </span>

                                        <strong>
                                            {
                                                treatmentData.doctor
                                            }
                                        </strong>

                                        {treatmentData.specialization && (
                                            <small>
                                                {
                                                    treatmentData.specialization
                                                }
                                            </small>
                                        )}
                                    </div>
                                </div>

                                {/* START DATE */}

                                <div className="treatment-info-item">
                                    <FiCalendar />

                                    <div>
                                        <span>
                                            {t(
                                                "treatment.startDate"
                                            )}
                                        </span>

                                        <strong>
                                            {formatDate(
                                                treatmentData.startDate
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {/* UPCOMING VISITS */}

                                <div className="treatment-info-item">
                                    <FiClock />

                                    <div>
                                        <span>
                                            {t(
                                                "treatment.upcomingVisits"
                                            )}
                                        </span>

                                        <strong>
                                            {
                                                treatmentData
                                                    .activeAppointments
                                                    .length
                                            }
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS */}

                        <div className="treatment-progress-card">
                            <div className="progress-card-header">
                                <span>
                                    {t(
                                        "treatment.progress"
                                    )}
                                </span>

                                <strong>
                                    {
                                        treatmentData.progress
                                    }
                                    %
                                </strong>
                            </div>

                            <div className="treatment-progress-bar">
                                <div
                                    className="treatment-progress-value"
                                    style={{
                                        width: `${treatmentData.progress}%`,
                                    }}
                                />
                            </div>

                            <p>
                                {t(
                                    "treatment.progressDescription"
                                )}
                            </p>
                        </div>
                    </section>

                    {/* TREATMENT TIMELINE */}

                    <section className="treatment-timeline-section">
                        <div className="section-title-row">
                            <div>
                                <h3 className="section-title">
                                    {t(
                                        "treatment.timeline"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "treatment.timelineDescription"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="treatment-timeline">
                            {timeline.length ===
                            0 ? (
                                <div className="timeline-item">
                                    <div className="timeline-icon">
                                        <FiClock />
                                    </div>

                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <div>
                                                <h4>
                                                    {t(
                                                        "treatment.noTimeline"
                                                    )}
                                                </h4>

                                                <p>
                                                    {t(
                                                        "treatment.noTimelineDescription"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                timeline.map(
                                    (
                                        step,
                                        index
                                    ) => (
                                        <div
                                            className={`timeline-item ${step.status}`}
                                            key={
                                                step.id
                                            }
                                        >
                                            {index !==
                                                timeline.length -
                                                    1 && (
                                                <div className="timeline-line" />
                                            )}

                                            <div className="timeline-icon">
                                                {step.status ===
                                                "completed" ? (
                                                    <FiCheck />
                                                ) : step.status ===
                                                  "current" ? (
                                                    <FiActivity />
                                                ) : (
                                                    <FiClock />
                                                )}
                                            </div>

                                            <div className="timeline-content">
                                                <div className="timeline-header">
                                                    <div>
                                                        <h4>
                                                            {
                                                                step.title
                                                            }
                                                        </h4>

                                                        <p>
                                                            {
                                                                step.description
                                                            }
                                                        </p>
                                                    </div>

                                                    <span className="timeline-date">
                                                        {formatDate(
                                                            step.date
                                                        )}
                                                    </span>
                                                </div>

                                                <span className="timeline-status">
                                                    {getTimelineStatusLabel(
                                                        step.status
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </section>

                    {/* TREATMENT NOTE */}

                    <section className="treatment-note">
                        <div className="treatment-note-icon">
                            <FiFileText />
                        </div>

                        <div>
                            <h3>
                                {t(
                                    "treatment.information"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "treatment.informationDescription"
                                )}
                            </p>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default Treatment;
