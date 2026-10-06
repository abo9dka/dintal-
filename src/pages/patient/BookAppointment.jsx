import {
    FiCalendar,
    FiUser,
    FiArrowRight,
    FiClock,
    FiFileText,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import patientService from "../../services/patientService";

function BookAppointment() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [date, setDate] = useState("");
    const [type, setType] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    const [availableSlots, setAvailableSlots] = useState([]);

    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================================
    // Local today's date
    // ==========================================================

    const getLocalDate = () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();

        const month = String(
            currentDate.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            currentDate.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const today = getLocalDate();

    // ==========================================================
    // Appointment Types
    // ==========================================================

    const appointmentTypes = [
        {
            value: "consultation",
            label: "Consultation",
            duration: "15 minutes",
        },
        {
            value: "cleaning",
            label: "Dental Cleaning",
            duration: "60 minutes",
        },
        {
            value: "orthodontics",
            label: "Orthodontics",
            duration: "30 minutes",
        },
        {
            value: "whitening",
            label: "Teeth Whitening",
            duration: "45 minutes",
        },
        {
            value: "treatment",
            label: "Dental Treatment",
            duration: "20 minutes",
        },
    ];

    // ==========================================================
    // Load Doctors
    // ==========================================================

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            setLoadingDoctors(true);
            setError("");

            const data =
                await patientService.getDoctors();

            const doctorsData = Array.isArray(data)
                ? data
                : data?.doctors || [];

            setDoctors(doctorsData);

            if (doctorsData.length > 0) {
                setSelectedDoctor(doctorsData[0]);
            }
        } catch (error) {
            console.error(
                "Failed to load doctors:",
                error
            );

            setDoctors([]);
            setSelectedDoctor(null);

            setError(
                error.response?.data?.message ||
                    "Unable to load doctors. Please try again."
            );
        } finally {
            setLoadingDoctors(false);
        }
    };

    // ==========================================================
    // Load Available Slots
    // ==========================================================

    const loadAvailableSlots = async (
        doctorId,
        selectedDate,
        selectedType
    ) => {
        if (
            !doctorId ||
            !selectedDate ||
            !selectedType
        ) {
            setAvailableSlots([]);
            return;
        }

        try {
            setLoadingSlots(true);
            setError("");
            setTime("");

            console.log("Loading slots:", {
                doctorId,
                selectedDate,
                selectedType,
            });

            const data =
                await patientService.getAvailableSlots(
                    doctorId,
                    selectedDate,
                    selectedType
                );

            console.log(
                "Available slots API response:",
                JSON.stringify(data, null, 2)
            );

            const slots = Array.isArray(
                data?.available_slots
            )
                ? data.available_slots
                : [];

            console.log(
                "All slots:",
                slots
            );

            const available = slots.filter(
                (slot) => slot?.available === true
            );

            console.log(
                "Available slots only:",
                available
            );

            setAvailableSlots(available);

            if (available.length === 0) {
                setError(
                    "No available appointments for this date and appointment type."
                );
            }
        } catch (error) {
            console.error(
                "Failed to load available slots:",
                error
            );

            setAvailableSlots([]);
            setTime("");

            const responseData =
                error.response?.data;

            setError(
                responseData?.message ||
                    "Unable to load available time slots."
            );
        } finally {
            setLoadingSlots(false);
        }
    };

    // ==========================================================
    // Automatically reload slots when all 3 values exist
    // ==========================================================

    useEffect(() => {
        if (
            selectedDoctor?.id &&
            date &&
            type
        ) {
            loadAvailableSlots(
                selectedDoctor.id,
                date,
                type
            );
        } else {
            setAvailableSlots([]);
            setTime("");
        }
    }, [
        selectedDoctor?.id,
        date,
        type,
    ]);

    // ==========================================================
    // Date Change
    // ==========================================================

    const handleDateChange = (value) => {
        setDate(value);
        setTime("");
        setAvailableSlots([]);
        setError("");
        setSuccess("");
    };

    // ==========================================================
    // Appointment Type Change
    // ==========================================================

    const handleTypeChange = (value) => {
        setType(value);
        setTime("");
        setAvailableSlots([]);
        setError("");
        setSuccess("");
    };

    // ==========================================================
    // Doctor Change
    // ==========================================================

    const handleDoctorChange = (doctor) => {
        setSelectedDoctor(doctor);
        setTime("");
        setAvailableSlots([]);
        setError("");
        setSuccess("");
    };

    // ==========================================================
    // Confirm Appointment
    // ==========================================================

    const handleConfirm = async () => {
        setError("");
        setSuccess("");

        if (!selectedDoctor) {
            setError("Please select a doctor.");
            return;
        }

        if (!date) {
            setError("Please select a date.");
            return;
        }

        if (date < today) {
            setError(
                "Please select a valid future date."
            );
            return;
        }

        if (!type) {
            setError(
                "Please select an appointment type."
            );
            return;
        }

        if (!time) {
            setError(
                "Please select an available time."
            );
            return;
        }

        try {
            setBooking(true);

            const response =
                await patientService.bookAppointment({
                    doctor_id: selectedDoctor.id,
                    appointment_date: date,
                    appointment_time: time,
                    type,
                    reason:
                        reason.trim() || null,
                });

            console.log(
                "Appointment booked successfully:",
                response
            );

            setSuccess(
                "Your appointment request has been submitted successfully."
            );

            setTimeout(() => {
                navigate(
                    "/patient/appointments"
                );
            }, 1200);
        } catch (error) {
            console.error(
                "Failed to book appointment:",
                error
            );

            const responseData =
                error.response?.data;

            let message =
                responseData?.message ||
                "Unable to book the appointment. Please try again.";

            if (
                responseData?.errors &&
                typeof responseData.errors ===
                    "object"
            ) {
                const firstError =
                    Object.values(
                        responseData.errors
                    )[0];

                if (
                    Array.isArray(firstError)
                ) {
                    message = firstError[0];
                } else if (
                    typeof firstError ===
                    "string"
                ) {
                    message = firstError;
                }
            }

            setError(message);
        } finally {
            setBooking(false);
        }
    };

    // ==========================================================
    // Helpers
    // ==========================================================

    const getDoctorName = (doctor) => {
        return (
            doctor?.name ||
            doctor?.user?.name ||
            "Unknown Doctor"
        );
    };

    const getDoctorSpecialization = (
        doctor
    ) => {
        return (
            doctor?.specialization ||
            "Dental Specialist"
        );
    };

    const getSlotTime = (slot) => {
        if (typeof slot === "string") {
            return slot;
        }

        return slot?.time || "";
    };

    // ==========================================================
    // Render
    // ==========================================================

    return (
        <div className="booking-page">
            <div className="page-heading">
                <div>
                    <h2>
                        Book an Appointment
                    </h2>

                    <p>
                        Choose a doctor, date and
                        time for your visit.
                    </p>
                </div>
            </div>

            <div className="booking-card">

                {/* STEP 1 */}

                <div className="booking-step">
                    <div className="step-number">
                        1
                    </div>

                    <div>
                        <span>
                            STEP 1
                        </span>

                        <h3>
                            Select Doctor
                        </h3>
                    </div>
                </div>

                {loadingDoctors ? (
                    <div className="doctor-option">
                        <div className="doctor-info">
                            <strong>
                                Loading doctors...
                            </strong>

                            <span>
                                Please wait.
                            </span>
                        </div>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="doctor-option">
                        <div className="doctor-info">
                            <strong>
                                No doctors available
                            </strong>

                            <span>
                                Please try again
                                later.
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="doctor-options">
                        {doctors.map(
                            (doctor) => (
                                <button
                                    type="button"
                                    className={`doctor-option ${
                                        selectedDoctor?.id ===
                                        doctor.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    key={doctor.id}
                                    onClick={() =>
                                        handleDoctorChange(
                                            doctor
                                        )
                                    }
                                >
                                    <div className="doctor-avatar">
                                        <FiUser />
                                    </div>

                                    <div className="doctor-info">
                                        <strong>
                                            {getDoctorName(
                                                doctor
                                            )}
                                        </strong>

                                        <span>
                                            {getDoctorSpecialization(
                                                doctor
                                            )}
                                        </span>
                                    </div>

                                    {selectedDoctor?.id ===
                                        doctor.id && (
                                        <div className="selected-check">
                                            ✓
                                        </div>
                                    )}
                                </button>
                            )
                        )}
                    </div>
                )}

                {/* STEP 2 */}

                <div className="booking-step">
                    <div className="step-number">
                        2
                    </div>

                    <div>
                        <span>
                            STEP 2
                        </span>

                        <h3>
                            Select Date
                        </h3>
                    </div>
                </div>

                <div className="booking-input">
                    <FiCalendar />

                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) =>
                            handleDateChange(
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* STEP 3 */}

                <div className="booking-step">
                    <div className="step-number">
                        3
                    </div>

                    <div>
                        <span>
                            STEP 3
                        </span>

                        <h3>
                            Appointment Type
                        </h3>
                    </div>
                </div>

                <div className="time-slots">
                    {appointmentTypes.map(
                        (appointmentType) => (
                            <button
                                key={
                                    appointmentType.value
                                }
                                type="button"
                                className={
                                    type ===
                                    appointmentType.value
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    handleTypeChange(
                                        appointmentType.value
                                    )
                                }
                            >
                                <strong>
                                    {
                                        appointmentType.label
                                    }
                                </strong>

                                <small>
                                    {
                                        appointmentType.duration
                                    }
                                </small>
                            </button>
                        )
                    )}
                </div>

                {/* STEP 4 */}

                <div className="booking-step">
                    <div className="step-number">
                        4
                    </div>

                    <div>
                        <span>
                            STEP 4
                        </span>

                        <h3>
                            Select Time
                        </h3>
                    </div>
                </div>

                {loadingSlots ? (
                    <div className="time-slots">
                        <button
                            type="button"
                            disabled
                        >
                            Loading available
                            times...
                        </button>
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="time-slots">
                        {availableSlots.map(
                            (slot) => {
                                const slotTime =
                                    getSlotTime(
                                        slot
                                    );

                                return (
                                    <button
                                        key={
                                            slotTime
                                        }
                                        type="button"
                                        className={
                                            time ===
                                            slotTime
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() => {
                                            setTime(
                                                slotTime
                                            );

                                            setError(
                                                ""
                                            );

                                            setSuccess(
                                                ""
                                            );
                                        }}
                                    >
                                        <FiClock />

                                        {
                                            slotTime
                                        }
                                    </button>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <div className="time-slots">
                        <button
                            type="button"
                            disabled
                        >
                            Select a doctor,
                            date and
                            appointment type
                            first
                        </button>
                    </div>
                )}

                {/* STEP 5 */}

                <div className="booking-step">
                    <div className="step-number">
                        5
                    </div>

                    <div>
                        <span>
                            STEP 5
                        </span>

                        <h3>
                            Reason{" "}
                            <small>
                                (Optional)
                            </small>
                        </h3>
                    </div>
                </div>

                <div className="booking-input">
                    <FiFileText />

                    <input
                        type="text"
                        placeholder="What is the reason for your visit?"
                        value={reason}
                        onChange={(e) => {
                            setReason(
                                e.target.value
                            );

                            setError("");
                            setSuccess("");
                        }}
                    />
                </div>

                {/* ERROR */}

                {error && (
                    <p className="error-text booking-error">
                        {error}
                    </p>
                )}

                {/* SUCCESS */}

                {success && (
                    <p className="success-text booking-error">
                        {success}
                    </p>
                )}

                {/* CONFIRM */}

                <button
                    type="button"
                    className="confirm-booking"
                    onClick={handleConfirm}
                    disabled={booking}
                >
                    {booking
                        ? "Booking Appointment..."
                        : "Confirm Appointment"}

                    {!booking && (
                        <FiArrowRight />
                    )}
                </button>
            </div>
        </div>
    );
}

export default BookAppointment;
