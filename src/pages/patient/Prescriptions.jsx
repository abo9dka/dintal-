import {
    FiCalendar,
    FiChevronRight,
    FiFileText,
    FiSearch,
    FiUser,
    FiX,
    FiClock,
    FiActivity,
} from "react-icons/fi";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import patientService from "../../services/patientService";
import { useLanguage } from "../../context/LanguageContext";

function Prescriptions() {
    const { t, language } = useLanguage();

    const [prescriptions, setPrescriptions] =
        useState([]);

    const [selectedPrescription, setSelectedPrescription] =
        useState(null);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================================================
       Load Prescriptions
    ========================================================= */

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await patientService.getPrescriptions();

            const prescriptionsData =
                Array.isArray(data)
                    ? data
                    : data?.prescriptions || [];

            setPrescriptions(
                Array.isArray(
                    prescriptionsData
                )
                    ? prescriptionsData
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load prescriptions:",
                error
            );

            setPrescriptions([]);

            setError(
                error.response?.data?.message ||
                    t(
                        "prescriptions.unableToLoad"
                    )
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
                setSelectedPrescription(null);
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

    const getDoctorName = (prescription) => {
        return (
            prescription?.doctor?.name ||
            prescription?.doctor?.user?.name ||
            prescription?.doctor_name ||
            t(
                "prescriptions.unknownDoctor"
            )
        );
    };

    const getSpecialization = (
        prescription
    ) => {
        return (
            prescription?.doctor
                ?.specialization ||
            ""
        );
    };

    const getPrescriptionDate = (
        prescription
    ) => {
        return (
            prescription?.appointment
                ?.date ||
            prescription?.appointment
                ?.appointment_date ||
            prescription?.created_at ||
            null
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return t(
                "prescriptions.unknownDate"
            );
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return t(
                "prescriptions.unknownDate"
            );
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
       Normalize Prescriptions
    ========================================================= */

    const normalizedPrescriptions =
        useMemo(() => {
            return prescriptions
                .map((prescription) => {
                    const items =
                        Array.isArray(
                            prescription?.items
                        )
                            ? prescription.items
                            : [];

                    const rawDate =
                        getPrescriptionDate(
                            prescription
                        );

                    return {
                        ...prescription,

                        doctorName:
                            getDoctorName(
                                prescription
                            ),

                        specialization:
                            getSpecialization(
                                prescription
                            ),

                        items,

                        rawDate,

                        formattedDate:
                            formatDate(
                                rawDate
                            ),
                    };
                })
                .sort((a, b) => {
                    const dateA =
                        a.rawDate
                            ? new Date(
                                  a.rawDate
                              ).getTime()
                            : 0;

                    const dateB =
                        b.rawDate
                            ? new Date(
                                  b.rawDate
                              ).getTime()
                            : 0;

                    return dateB - dateA;
                });
        }, [
            prescriptions,
            language,
        ]);

    /* =========================================================
       Search
    ========================================================= */

    const filteredPrescriptions =
        useMemo(() => {
            const searchValue =
                search.trim().toLowerCase();

            if (!searchValue) {
                return normalizedPrescriptions;
            }

            return normalizedPrescriptions.filter(
                (prescription) => {
                    const medicines =
                        prescription.items
                            .map(
                                (item) =>
                                    item?.medicine_name ||
                                    ""
                            )
                            .join(" ");

                    const searchableText = [
                        prescription.doctorName,
                        prescription.specialization,
                        prescription.notes ||
                            "",
                        medicines,
                    ]
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(
                        searchValue
                    );
                }
            );
        }, [
            normalizedPrescriptions,
            search,
        ]);

    /* =========================================================
       Summary
    ========================================================= */

    const totalMedicines =
        normalizedPrescriptions.reduce(
            (total, prescription) =>
                total +
                prescription.items.length,
            0
        );

    const lastPrescription =
        normalizedPrescriptions.length > 0
            ? normalizedPrescriptions[0]
            : null;

    /* =========================================================
       Render
    ========================================================= */

    return (
        <div className="prescriptions-page">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-heading">
                <div>
                    <h2>
                        {t(
                            "prescriptions.title"
                        )}
                    </h2>

                    <p>
                        {t(
                            "prescriptions.description"
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
                                "prescriptions.totalPrescriptions"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : normalizedPrescriptions.length}
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
                                "prescriptions.medications"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : totalMedicines}
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
                                "prescriptions.latestPrescription"
                            )}
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : lastPrescription
                                ? lastPrescription.formattedDate
                                : t(
                                      "prescriptions.noPrescriptions"
                                  )}
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
                            "prescriptions.searchPlaceholder"
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
                PRESCRIPTIONS
            ================================================== */}

            <section className="records-section">
                <h3 className="section-title">
                    {t(
                        "prescriptions.yourPrescriptions"
                    )}
                </h3>

                {/* LOADING */}

                {loading && (
                    <div className="empty-records">
                        <FiFileText />

                        <h3>
                            {t(
                                "prescriptions.loading"
                            )}
                        </h3>

                        <p>
                            {t(
                                "prescriptions.loadingDescription"
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
                                "prescriptions.unableToLoad"
                            )}
                        </h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="record-modal-button"
                            onClick={
                                loadPrescriptions
                            }
                        >
                            {t(
                                "prescriptions.retry"
                            )}
                        </button>
                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredPrescriptions.length ===
                        0 && (
                        <div className="empty-records">
                            <FiFileText />

                            <h3>
                                {prescriptions.length ===
                                0
                                    ? t(
                                          "prescriptions.noPrescriptions"
                                      )
                                    : t(
                                          "prescriptions.noResults"
                                      )}
                            </h3>

                            <p>
                                {prescriptions.length ===
                                0
                                    ? t(
                                          "prescriptions.noPrescriptionsDescription"
                                      )
                                    : t(
                                          "prescriptions.noResultsDescription"
                                      )}
                            </p>
                        </div>
                    )}

                {/* LIST */}

                {!loading &&
                    !error &&
                    filteredPrescriptions.length >
                        0 && (
                        <div className="records-list">
                            {filteredPrescriptions.map(
                                (prescription) => {
                                    const medicineCount =
                                        prescription
                                            .items
                                            .length;

                                    return (
                                        <div
                                            className="medical-record-card"
                                            key={
                                                prescription.id
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
                                                            {t(
                                                                "prescriptions.prescription"
                                                            )}
                                                        </span>

                                                        <h3>
{medicineCount > 0
    ? language === "ar"
        ? `${medicineCount} ${
              medicineCount === 1
                  ? "دواء"
                  : "أدوية"
          }`
        : `${medicineCount} ${
              medicineCount === 1
                  ? "Medication"
                  : "Medications"
          }`
    : t(
          "prescriptions.prescription"
      )}
                                                        </h3>
                                                    </div>

                                                    <span className="record-date">
                                                        <FiCalendar />

                                                        {
                                                            prescription.formattedDate
                                                        }
                                                    </span>
                                                </div>

                                                {/* DESCRIPTION */}

                                                <p className="record-description">
                                                    {prescription.notes ||
                                                        t(
                                                            "prescriptions.issuedByDentist"
                                                        )}
                                                </p>

                                                {/* FOOTER */}

                                                <div className="record-footer">
                                                    <div className="record-doctor">
                                                        <FiUser />

                                                        <span>
                                                            {
                                                                prescription.doctorName
                                                            }

                                                            {prescription.specialization
                                                                ? ` • ${prescription.specialization}`
                                                                : ""}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="record-details-button"
                                                        onClick={() =>
                                                            setSelectedPrescription(
                                                                prescription
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            "prescriptions.viewDetails"
                                                        )}

                                                        <FiChevronRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
            </section>

            {/* ==================================================
                DETAILS MODAL
            ================================================== */}

            {selectedPrescription && (
                <div
                    className="record-modal-overlay"
                    onClick={() =>
                        setSelectedPrescription(
                            null
                        )
                    }
                >
                    <div
                        className="record-modal prescription-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* MODAL HEADER */}

                        <div className="record-modal-header">
                            <div>
                                <span>
                                    {t(
                                        "prescriptions.prescription"
                                    )}
                                </span>

                                <h3>
                                    {t(
                                        "prescriptions.medicationDetails"
                                    )}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="record-modal-close"
                                aria-label={t(
                                    "prescriptions.close"
                                )}
                                onClick={() =>
                                    setSelectedPrescription(
                                        null
                                    )
                                }
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* PRESCRIPTION INFO */}

                        <div className="record-modal-info">
                            <div>
                                <span>
                                    {t(
                                        "prescriptions.date"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedPrescription.formattedDate
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {t(
                                        "prescriptions.doctor"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedPrescription.doctorName
                                    }
                                </strong>
                            </div>
                        </div>

                        {/* SPECIALIZATION */}

                        {selectedPrescription.specialization && (
                            <div className="record-modal-description">
                                <span>
                                    {t(
                                        "prescriptions.specialization"
                                    )}
                                </span>

                                <p>
                                    {
                                        selectedPrescription.specialization
                                    }
                                </p>
                            </div>
                        )}

                        {/* NOTES */}

                        {selectedPrescription.notes && (
                            <div className="record-modal-description">
                                <span>
                                    {t(
                                        "prescriptions.doctorNotes"
                                    )}
                                </span>

                                <p>
                                    {
                                        selectedPrescription.notes
                                    }
                                </p>
                            </div>
                        )}

                        {/* MEDICATIONS */}

                        <div className="prescription-items">
                            <span className="prescription-section-label">
                                {t(
                                    "prescriptions.medications"
                                )}
                            </span>

                            {selectedPrescription
                                .items.length === 0 ? (
                                <p>
                                    {t(
                                        "prescriptions.noMedications"
                                    )}
                                </p>
                            ) : (
                                selectedPrescription.items.map(
                                    (item) => (
                                        <div
                                            className="prescription-item"
                                            key={
                                                item.id
                                            }
                                        >
                                            <div className="prescription-item-header">
                                                <h4>
                                                    {item.medicine_name ||
                                                        t(
                                                            "prescriptions.unnamedMedication"
                                                        )}
                                                </h4>
                                            </div>

                                            <div className="prescription-item-details">
                                                {item.dosage && (
                                                    <div>
                                                        <span>
                                                            {t(
                                                                "prescriptions.dosage"
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {
                                                                item.dosage
                                                            }
                                                        </strong>
                                                    </div>
                                                )}

                                                {item.frequency && (
                                                    <div>
                                                        <span>
                                                            <FiClock />

                                                            {t(
                                                                "prescriptions.frequency"
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {
                                                                item.frequency
                                                            }
                                                        </strong>
                                                    </div>
                                                )}

                                                {item.duration && (
                                                    <div>
                                                        <span>
                                                            {t(
                                                                "prescriptions.duration"
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {
                                                                item.duration
                                                            }
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>

                                            {item.instructions && (
                                                <div className="prescription-instructions">
                                                    <span>
                                                        {t(
                                                            "prescriptions.instructions"
                                                        )}
                                                    </span>

                                                    <p>
                                                        {
                                                            item.instructions
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )
                            )}
                        </div>

                        {/* CLOSE */}

                        <button
                            type="button"
                            className="record-modal-button"
                            onClick={() =>
                                setSelectedPrescription(
                                    null
                                )
                            }
                        >
                            {t(
                                "prescriptions.close"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Prescriptions;