import api from "./api";

const fallbackDashboard = {
  appointments_count: 12,
  today_appointments: 4,
  pending_appointments: 3,
  confirmed_appointments: 5,
  completed_appointments: 4,
};

const doctorService = {
  // ================================
  // Dashboard
  // ================================
  getDashboard: async () => {
    try {
      const response = await api.get("/doctor/dashboard");

      return response?.data?.data ?? response?.data ?? fallbackDashboard;
    } catch (error) {
      console.warn(
        "Doctor dashboard endpoint unavailable, using fallback data:",
        error,
      );

      return fallbackDashboard;
    }
  },

  // ================================
  // Profile
  // ================================
  getProfile: async () => {
    const response = await api.get("/doctor/profile");

    return response.data.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/doctor/profile", data);

    return response.data.data;
  },

  // ================================
  // Appointments
  // ================================
  getAppointments: async (params = {}) => {
    const response = await api.get("/doctor/appointments", {
      params,
    });

    return response.data;
  },

  getAppointment: async (id) => {
    const response = await api.get(`/doctor/appointments/${id}`);

    return response.data.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/doctor/appointments/${id}/status`, {
      status,
    });

    return response.data.data;
  },

  // ================================
  // Working Hours
  // ================================
  getWorkingHours: async () => {
    const response = await api.get("/doctor/working-hours");

    return response.data.data;
  },

  addWorkingHour: async (data) => {
    const response = await api.post("/doctor/working-hours", data);

    return response.data.data;
  },

  updateWorkingHour: async (id, data) => {
    const response = await api.put(`/doctor/working-hours/${id}`, data);

    return response.data.data;
  },

  deleteWorkingHour: async (id) => {
    const response = await api.delete(`/doctor/working-hours/${id}`);

    return response.data.data;
  },

  // ================================
  // Medical Records
  // ================================
  getMedicalRecords: async () => {
    const response = await api.get("/doctor/medical-records");

    return response.data.data;
  },

  createMedicalRecord: async (data) => {
    const response = await api.post("/doctor/medical-records", data);

    return response.data.data;
  },

  updateMedicalRecord: async (id, data) => {
    const response = await api.put(`/doctor/medical-records/${id}`, data);

    return response.data.data;
  },

  deleteMedicalRecord: async (id) => {
    const response = await api.delete(`/doctor/medical-records/${id}`);

    return response.data.data;
  },

  // ================================
  // Prescriptions
  // ================================
  getPrescriptions: async () => {
    const response = await api.get("/doctor/prescriptions");

    return response.data.data;
  },

  createPrescription: async (data) => {
    const response = await api.post("/doctor/prescriptions", data);

    return response.data.data;
  },

  updatePrescription: async (id, data) => {
    const response = await api.put(`/doctor/prescriptions/${id}`, data);

    return response.data.data;
  },

  deletePrescription: async (id) => {
    const response = await api.delete(`/doctor/prescriptions/${id}`);

    return response.data.data;
  },
  getPatients: async () => {
    const response = await api.get("/doctor/patients");
    return response.data.data;
  },
  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", {
      params,
    });

    return response.data;
  },

  getUnreadNotifications: async () => {
    const response = await api.get("/notifications/unread");

    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);

    return response.data.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put("/notifications/read-all");

    return response.data.data;
  },
};

export default doctorService;
