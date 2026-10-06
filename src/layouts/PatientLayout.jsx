import { Outlet } from "react-router-dom";

function PatientLayout() {
  return (
    <div className="patient-layout">

      <aside className="patient-sidebar">
        <div className="sidebar-logo">
          🦷 DentalCare
        </div>

        <nav className="sidebar-nav">
          <a href="/patient">🏠 Dashboard</a>
          <a href="/patient/doctors">👨‍⚕️ Find a Doctor</a>
          <a href="/patient/appointments">📅 Appointments</a>
          <a href="/patient/dental-health">🦷 Dental Health</a>
          <a href="/patient/records">📋 Medical Records</a>
          <a href="/patient/prescriptions">💊 Prescriptions</a>
          <a href="/patient/x-rays">📷 X-Rays</a>
          <a href="/patient/messages">💬 Messages</a>
          <a href="/patient/notifications">🔔 Notifications</a>
        </nav>

        <div className="sidebar-bottom">
          <a href="/patient/profile">👤 Profile</a>
          <a href="/patient/settings">⚙️ Settings</a>
          <button type="button">🚪 Logout</button>
        </div>
      </aside>

      <main className="patient-main">
        <header className="patient-header">
          <div>
            <h1>Patient Portal</h1>
          </div>

          <div className="header-user">
            <span>🔔</span>
            <span>Ahmed</span>
            <span>👤</span>
          </div>
        </header>

        <section className="patient-content">
          <Outlet />
        </section>
      </main>

    </div>
  );
}

export default PatientLayout;