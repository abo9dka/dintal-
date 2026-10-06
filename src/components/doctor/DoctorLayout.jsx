import { useState } from "react";
import { Outlet } from "react-router-dom";

import DoctorSidebar from "./DoctorSidebar";
import DoctorHeader from "./DoctorHeader";

function DoctorLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="doctor-layout">
            <DoctorSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="doctor-main">
                <DoctorHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="doctor-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DoctorLayout;
