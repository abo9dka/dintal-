import api from "./api";

const patientService = {
  // ==============================
  // PROFILE
  // ==============================

  getProfile: async () => {
    const response = await api.get("/patient/profile");

    return response.data.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/patient/profile", data);

    return response.data.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/patient/password", data);

    return response.data.data;
  },

  // ==============================
  // APPOINTMENTS
  // ==============================

  getAppointments: async () => {
    const response = await api.get("/patient/appointments");

    return response.data.data;
  },

  getAppointment: async (id) => {
    const response = await api.get(`/patient/appointments/${id}`);

    return response.data.data;
  },

  bookAppointment: async (data) => {
    const response = await api.post("/patient/appointments", data);

    return response.data.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(`/patient/appointments/${id}`);

    return response.data.data;
  },

  // ==============================
  // MEDICAL RECORDS
  // ==============================

  getMedicalRecords: async () => {
    const response = await api.get("/patient/medical-records");

    return response.data.data;
  },

  // ==============================
  // PRESCRIPTIONS
  // ==============================

  getPrescriptions: async () => {
    const response = await api.get("/patient/prescriptions");

    return response.data.data;
  },

  getPrescription: async (id) => {
    const response = await api.get(`/patient/prescriptions/${id}`);

    return response.data.data;
  },

  // ==============================
  // NOTIFICATIONS
  // ==============================

  getNotifications: async () => {
    const response = await api.get("/notifications");

    return response.data.data;
  },

  getUnreadNotifications: async () => {
    const response = await api.get("/notifications/unread");

    return response.data.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);

    return response.data.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put("/notifications/read-all");

    return response.data.data;
  },

  // ==============================
  // DOCTORS & AVAILABLE SLOTS
  // ==============================

  getDoctors: async () => {
    const response = await api.get("/doctors");

    return response.data.data;
  },

  getAvailableSlots: async (doctorId, date, type) => {
    const response = await api.get(
      `/doctors/${doctorId}/available-slots?date=${encodeURIComponent(date)}&type=${encodeURIComponent(type)}`,
    );

    return response.data.data;
  },
};

export default patientService;
