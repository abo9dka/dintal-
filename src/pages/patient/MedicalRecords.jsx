import {
    FiActivity,
    FiCalendar,
    FiChevronRight,
    FiFileText,
    FiSearch,
    FiUser,
} from "react-icons/fi";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function MedicalRecords() {
    const { t, language } = useLanguage();

    const [search, setSearch] = useState("");
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] =
        useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================================================
       Load Medical Records
    ========================================================= */

    useEffect(() => {
        loadMedicalRecords();
    }, []);

    const loadMedicalRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await patientService.getMedicalRecords();

            const recordsData = Array.isArray(data)
                ? data
                : data?.records ||
                  data?.medical_records ||
                  [];

            setRecords(
                Array.isArray(recordsData)
                    ? recordsData
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load medical records:",
                error
            );

            setRecords([]);

            setError(
                error.response?.data?.message ||
                    t("medicalRecords.unableToLoad")
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       Close Modal With Escape
    ========================================================= */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedRecord(null);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    /* =========================================================
       Helpers
    ========================================================= */

    const getDoctorName = (record) => {
        return (
            record?.doctor?.user?.name ||
            record?.doctor?.name ||
            record?.doctor_name ||
            t("medicalRecords.unknownDoctor")
        );
    };

    const getRecordDate = (record) => {
        return (
            record?.created_at ||
            record?.date ||
            record?.appointment?.appointment_date ||
            null
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return t("medicalRecords.unknownDate");
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return t("medicalRecords.unknownDate");
        }

        return parsedDate.toLocaleDateString(
            language === "ar"
                ? "ar-SA"
                : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    /* =========================================================
       Normalize Records
    ========================================================= */

    const normalizedRecords = useMemo(() => {
        return records
            .map((record) => {
                const diagnosis =
                    record?.diagnosis?.trim?.() ||
                    record?.diagnosis ||
                    "";

                const treatment =
                    record?.treatment?.trim?.() ||
                    record?.treatment ||
                    "";

                const notes =
                    record?.notes?.trim?.() ||
                    record?.notes ||
                    "";

                const rawDate =
                    getRecordDate(record);

                let type = t(
                    "medicalRecords.medicalRecord"
                );

                let category = t(
                    "medicalRecords.medical"
                );

                if (diagnosis) {
                    type = t(
                        "medicalRecords.dentalDiagnosis"
                    );

                    category = t(
                        "medicalRecords.diagnosis"
                    );
                } else if (treatment) {
                    type = t(
                        "medicalRecords.dentalTreatment"
                    );

                    category = t(
                        "medicalRecords.treatment"
                    );
                }

                const description =
                    diagnosis ||
                    treatment ||
                    notes ||
                    t(
                        "medicalRecords.recordDetailsAvailable"
                    );

                const details = [
                    diagnosis
                        ? `${t(
                              "medicalRecords.diagnosis"
                          )}: ${diagnosis}`
                        : null,

                    treatment
                        ? `${t(
                              "medicalRecords.treatment"
                          )}: ${treatment}`
                        : null,

                    notes
                        ? `${t(
                              "medicalRecords.medicalNotes"
                          )}: ${notes}`
                        : null,
                ]
                    .filter(Boolean)
                    .join("\n\n");

                return {
                    ...record,

                    type,
                    category,

                    doctor:
                        getDoctorName(record),

                    rawDate,

                    date:
                        formatDate(rawDate),

                    description,

                    details:
                        details ||
                        t(
                            "medicalRecords.noAdditionalNotes"
                        ),
                };
            })
            .sort((a, b) => {
                const dateA = a.rawDate
                    ? new Date(
                          a.rawDate
                      ).getTime()
                    : 0;

                const dateB = b.rawDate
                    ? new Date(
                          b.rawDate
                      ).getTime()
                    : 0;

                return dateB - dateA;
            });
    }, [records, language]);

    /* =========================================================
       Search
    ========================================================= */

    const filteredRecords = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        if (!searchValue) {
            return normalizedRecords;
        }

        return normalizedRecords.filter(
            (record) => {
                const searchableText = [
                    record.type,
                    record.category,
                    record.doctor,
                    record.description,
                    record.details,
                    record.diagnosis,
                    record.treatment,
                    record.notes,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    searchValue
                );
            }
        );
    }, [normalizedRecords, search]);

    /* =========================================================
       Summary
    ========================================================= */

    const treatmentCount =
        normalizedRecords.filter(
            (record) =>
                record?.treatment?.trim?.()
        ).length;

    const lastVisit =
        normalizedRecords.length > 0
            ? normalizedRecords[0].date
            : t("medicalRecords.noVisits");

    /* =========================================================
       Render
    ========================================================= */

    return (
        <div className="medical-records-page">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-heading">
                <div>
                    <h2>
                        {t(
                            "medicalRecords.title"
                        )}
                    </h2>

                    <p>
                        {t(
                            "medicalRecords.description"
                        )}
                    </p>
                </div>
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="records-summary">
                <div className="records-summary-card">
                    <div className="records-summary-icon">
                        <FiFileText />
                    </div>

                    <div>
                        <span>
                            {t(
                                "medicalRecords.totalRecords"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : normalizedRecords.length}
                        </strong>
                    </div>
                </div>

                <div className="records-summary-card">
                    <div className="records-summary-icon">
                        <FiActivity />
                    </div>

                    <div>
                        <span>
                            {t(
                                "medicalRecords.treatments"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : treatmentCount}
                        </strong>
                    </div>
                </div>

                <div className="records-summary-card">
                    <div className="records-summary-icon">
                        <FiCalendar />
                    </div>

                    <div>
                        <span>
                            {t(
                                "medicalRecords.lastVisit"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : lastVisit}
                        </strong>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="records-toolbar">
                <div className="records-search">
                    <FiSearch />

                    <input
                        type="text"
                        placeholder={t(
                            "medicalRecords.searchPlaceholder"
                        )}
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            {/* ==================================================
                RECORDS
            ================================================== */}

            <section className="records-section">
                <h3 className="section-title">
                    {t(
                        "medicalRecords.medicalHistory"
                    )}
                </h3>

                {/* LOADING */}

                {loading && (
                    <div className="empty-records">
                        <FiFileText />

                        <h3>
                            {t(
                                "medicalRecords.loading"
                            )}
                        </h3>

                        <p>
                            {t(
                                "medicalRecords.loadingDescription"
                            )}
                        </p>
                    </div>
                )}

                {/* ERROR */}

                {!loading && error && (
                    <div className="empty-records">
                        <FiFileText />

                        <h3>
                            {t(
                                "medicalRecords.unableToLoad"
                            )}
                        </h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="record-modal-button"
                            onClick={
                                loadMedicalRecords
                            }
                        >
                            {t(
                                "medicalRecords.retry"
                            )}
                        </button>
                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredRecords.length === 0 && (
                        <div className="empty-records">
                            <FiFileText />

                            <h3>
                                {records.length ===
                                0
                                    ? t(
                                          "medicalRecords.noRecords"
                                      )
                                    : t(
                                          "medicalRecords.noResults"
                                      )}
                            </h3>

                            <p>
                                {records.length ===
                                0
                                    ? t(
                                          "medicalRecords.noRecordsDescription"
                                      )
                                    : t(
                                          "medicalRecords.noResultsDescription"
                                      )}
                            </p>
                        </div>
                    )}

                {/* RECORD LIST */}

                {!loading &&
                    !error &&
                    filteredRecords.length > 0 && (
                        <div className="records-list">
                            {filteredRecords.map(
                                (record) => (
                                    <div
                                        className="medical-record-card"
                                        key={
                                            record.id
                                        }
                                    >
                                        <div className="record-icon">
                                            <FiFileText />
                                        </div>

                                        <div className="record-main">
                                            {/* HEADER */}

                                            <div className="record-header">
                                                <div>
                                                    <span className="record-category">
                                                        {
                                                            record.category
                                                        }
                                                    </span>

                                                    <h3>
                                                        {
                                                            record.type
                                                        }
                                                    </h3>
                                                </div>

                                                <span className="record-date">
                                                    <FiCalendar />

                                                    {
                                                        record.date
                                                    }
                                                </span>
                                            </div>

                                            {/* DESCRIPTION */}

                                            <p className="record-description">
                                                {
                                                    record.description
                                                }
                                            </p>

                                            {/* FOOTER */}

                                            <div className="record-footer">
                                                <div className="record-doctor">
                                                    <FiUser />

                                                    <span>
                                                        {
                                                            record.doctor
                                                        }
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="record-details-button"
                                                    onClick={() =>
                                                        setSelectedRecord(
                                                            record
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        "medicalRecords.recordDetails"
                                                    )}

                                                    <FiChevronRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </section>

            {/* ==================================================
                DETAILS MODAL
            ================================================== */}

            {selectedRecord && (
                <div
                    className="record-modal-overlay"
                    onClick={() =>
                        setSelectedRecord(null)
                    }
                >
                    <div
                        className="record-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* MODAL HEADER */}

                        <div className="record-modal-header">
                            <div>
                                <span>
                                    {
                                        selectedRecord.category
                                    }
                                </span>

                                <h3>
                                    {
                                        selectedRecord.type
                                    }
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="record-modal-close"
                                aria-label={t(
                                    "medicalRecords.close"
                                )}
                                onClick={() =>
                                    setSelectedRecord(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>
                        </div>

                        {/* INFO */}

                        <div className="record-modal-info">
                            <div>
                                <span>
                                    {t(
                                        "medicalRecords.date"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedRecord.date
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {t(
                                        "medicalRecords.doctor"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedRecord.doctor
                                    }
                                </strong>
                            </div>
                        </div>

                        {/* DESCRIPTION */}

                        <div className="record-modal-description">
                            <span>
                                {t(
                                    "medicalRecords.descriptionLabel"
                                )}
                            </span>

                            <p>
                                {
                                    selectedRecord.description
                                }
                            </p>
                        </div>

                        {/* MEDICAL NOTES */}

                        <div className="record-modal-details">
                            <span>
                                {t(
                                    "medicalRecords.medicalNotes"
                                )}
                            </span>

                            <p
                                style={{
                                    whiteSpace:
                                        "pre-line",
                                }}
                            >
                                {
                                    selectedRecord.details
                                }
                            </p>
                        </div>

                        {/* CLOSE */}

                        <button
                            type="button"
                            className="record-modal-button"
                            onClick={() =>
                                setSelectedRecord(
                                    null
                                )
                            }
                        >
                            {t(
                                "medicalRecords.close"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MedicalRecords;