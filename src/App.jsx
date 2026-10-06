import { Navigate, Route, Routes } from "react-router-dom";
// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PatientLayout from "./components/patient/PatientLayout";

// PATIENT
import PatientHome from "./pages/patient/PatientHome";
import Appointments from "./pages/patient/Appointments";
import BookAppointment from "./pages/patient/BookAppointment";
import Treatment from "./pages/patient/Treatment";
import MedicalRecords from "./pages/patient/MedicalRecords";
import Prescriptions from "./pages/patient/Prescriptions";
import Notifications from "./pages/patient/Notifications";
import Profile from "./pages/patient/Profile";

// DOCTOR
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorWorkingHours from "./pages/doctor/DoctorWorkingHours";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorNotifications from "./pages/doctor/DoctorNotifications";
// SECURITY
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* =========================
                AUTHENTICATION
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

{/* =========================
    PATIENT ROUTES
========================= */}

<Route
    element={
        <ProtectedRoute
            allowedRoles={["patient"]}
        />
    }
>
    {/* الصفحة الرئيسية — لا نلمسها */}
    <Route
        path="/patient"
        element={<PatientHome />}
    />

    {/* باقي صفحات المريض — معها Sidebar */}
    <Route element={<PatientLayout />}>
        <Route
            path="/patient/appointments"
            element={<Appointments />}
        />

        <Route
            path="/patient/appointments/book"
            element={<BookAppointment />}
        />

        <Route
            path="/patient/treatment"
            element={<Treatment />}
        />

        <Route
            path="/patient/records"
            element={<MedicalRecords />}
        />

        <Route
            path="/patient/prescriptions"
            element={<Prescriptions />}
        />

        <Route
            path="/patient/notifications"
            element={<Notifications />}
        />

        <Route
            path="/patient/profile"
            element={<Profile />}
        />
    </Route>
</Route>
            {/* =========================
                DOCTOR ROUTES
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["doctor"]}
                    />
                }
            >
<Route element={<DoctorLayout />}>

    <Route
        path="/doctor"
        element={<DoctorHome />}
    />

    <Route
        path="/doctor/appointments"
        element={<DoctorAppointments />}
    />

    <Route
        path="/doctor/working-hours"
        element={<DoctorWorkingHours />}
    />

    <Route
        path="/doctor/patients"
        element={<DoctorPatients />}
    />

    <Route
        path="/doctor/medical-records"
        element={<DoctorMedicalRecords />}
    />

    <Route
        path="/doctor/prescriptions"
        element={<DoctorPrescriptions />}
    />

    <Route
        path="/doctor/profile"
        element={<DoctorProfile />}
    />

    <Route
        path="/doctor/notifications"
        element={<DoctorNotifications />}
    />

</Route>
            </Route>

            {/* =========================
                DEFAULT ROUTE
            ========================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* =========================
                UNKNOWN ROUTES
            ========================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;
