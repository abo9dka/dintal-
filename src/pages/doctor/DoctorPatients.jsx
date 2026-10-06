import { useEffect, useMemo, useState } from "react";

import {
    FiUsers,
    FiSearch,
    FiPhone,
    FiMail,
    FiCalendar,
    FiRefreshCw,
    FiAlertCircle,
    FiUser,
} from "react-icons/fi";

import doctorService from "../../services/doctorService";
import { useLanguage } from "../../context/LanguageContext";

function DoctorPatients() {
    const { t, language } = useLanguage();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await doctorService.getPatients();

            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Doctor patients error:", err);

            setError(
                err.response?.data?.message ||
                    t("patients.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return patients;
        }

        return patients.filter((patient) => {
            const name =
                patient.user?.name?.toLowerCase() || "";

            const email =
                patient.user?.email?.toLowerCase() || "";

            const phone =
                patient.phone?.toLowerCase() || "";

            return (
                name.includes(query) ||
                email.includes(query) ||
                phone.includes(query)
            );
        });
    }, [patients, search]);

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            language === "ar" ? "ar-SA" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    return (
        <div className="doctor-patients-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="doctor-page-header">
                <div>
                    <span className="doctor-page-eyebrow">
                        {t("patients.eyebrow")}
                    </span>

                    <h1>
                        {t("patients.title")}
                    </h1>

                    <p>
                        {t("patients.description")}
                    </p>
                </div>

                <button
                    type="button"
                    className="doctor-refresh-button"
                    onClick={loadPatients}
                    disabled={loading}
                    title={t("patients.refresh")}
                >
                    <FiRefreshCw
                        size={18}
                        className={
                            loading
                                ? "doctor-spin"
                                : ""
                        }
                    />
                </button>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            {!loading && !error && (
                <div className="doctor-patients-summary">
                    <div className="doctor-patients-summary-icon">
                        <FiUsers size={21} />
                    </div>

                    <div>
                        <strong>
                            {patients.length}
                        </strong>

                        <span>
                            {t("patients.totalPatients")}
                        </span>
                    </div>
                </div>
            )}

            {/* =========================
                SEARCH
            ========================= */}

            <div className="doctor-patients-toolbar">
                <div className="doctor-patients-search">
                    <FiSearch size={18} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder={t(
                            "patients.searchPlaceholder"
                        )}
                    />
                </div>

                {!loading && (
                    <span className="doctor-patients-count">
                        {filteredPatients.length}{" "}
                        {filteredPatients.length === 1
                            ? t("patients.patient")
                            : t("patients.patients")}
                    </span>
                )}
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="doctor-patients-error">
                    <FiAlertCircle size={20} />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadPatients}
                    >
                        {t("patients.tryAgain")}
                    </button>
                </div>
            )}

            {/* =========================
                LOADING / EMPTY / DATA
            ========================= */}

            {loading ? (
                <div className="doctor-patients-state">
                    <div className="doctor-spinner"></div>

                    <p>
                        {t("patients.loading")}
                    </p>
                </div>
            ) : filteredPatients.length === 0 ? (
                <div className="doctor-patients-empty">
                    <div className="doctor-empty-icon">
                        <FiUsers size={30} />
                    </div>

                    <h2>
                        {search
                            ? t(
                                  "patients.noPatientsFound"
                              )
                            : t(
                                  "patients.noPatientsYet"
                              )}
                    </h2>

                    <p>
                        {search
                            ? t(
                                  "patients.noPatientsFoundDescription"
                              )
                            : t(
                                  "patients.noPatientsYetDescription"
                              )}
                    </p>
                </div>
            ) : (
                <div className="doctor-patients-grid">
                    {filteredPatients.map((patient) => {
                        const patientName =
                            patient.user?.name ||
                            t("patients.unknownPatient");

                        const initial =
                            patientName
                                .charAt(0)
                                .toUpperCase();

                        return (
                            <article
                                key={patient.id}
                                className="doctor-patient-card"
                            >
                                {/* CARD HEADER */}

                                <div className="doctor-patient-card-header">
                                    <div className="doctor-patient-card-avatar">
                                        {initial}
                                    </div>

                                    <div className="doctor-patient-card-name">
                                        <h2>
                                            {patientName}
                                        </h2>

                                        <span>
                                            {t(
                                                "patients.patientId"
                                            )}{" "}
                                            #{patient.id}
                                        </span>
                                    </div>
                                </div>

                                {/* CONTACT */}

                                <div className="doctor-patient-contact">
                                    <div>
                                        <FiPhone />

                                        <span>
                                            {patient.phone ||
                                                t(
                                                    "patients.noPhone"
                                                )}
                                        </span>
                                    </div>

                                    <div>
                                        <FiMail />

                                        <span>
                                            {patient.user
                                                ?.email ||
                                                t(
                                                    "patients.noEmail"
                                                )}
                                        </span>
                                    </div>
                                </div>

                                {/* INFO */}

                                <div className="doctor-patient-card-info">
                                    <div>
                                        <FiCalendar />

                                        <span>
                                            {t(
                                                "patients.dateOfBirth"
                                            )}
                                        </span>

                                        <strong>
                                            {formatDate(
                                                patient.date_of_birth
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <FiUser />

                                        <span>
                                            {t(
                                                "patients.gender"
                                            )}
                                        </span>

                                        <strong>
                                            {patient.gender ||
                                                t(
                                                    "patients.notSpecified"
                                                )}
                                        </strong>
                                    </div>
                                </div>

                                {/* APPOINTMENTS */}

                                <div className="doctor-patient-appointments">
                                    <span>
                                        {t(
                                            "patients.appointmentsWithYou"
                                        )}
                                    </span>

                                    <strong>
                                        {patient.appointments_count ??
                                            0}
                                    </strong>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default DoctorPatients;