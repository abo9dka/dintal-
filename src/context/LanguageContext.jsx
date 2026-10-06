import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const LanguageContext = createContext(null);

const translations = {
    en: {
        auth: {
            login: {
                welcomeBack: "Welcome back",
                description:
                    "Sign in to manage your dental practice",
                email: "Email",
                emailPlaceholder: "Enter your email",
                password: "Password",
                passwordPlaceholder: "Enter your password",
                rememberMe: "Remember me",
                forgotPassword: "Forgot password?",
                signIn: "Sign in",
                signingIn: "Signing in...",
                orContinueWith: "OR CONTINUE WITH",
                continueWithGoogle: "Continue with Google",
                continueWithInstagram:
                    "Continue with Instagram",
                noAccount: "Don't have an account?",
                createAccount: "Create account",
                required:
                    "Please enter your email and password",
                unknownRole: "Unknown user role.",
                invalidLogin:
                    "Invalid login information.",
                invalidCredentials:
                    "Invalid email or password.",
                serverError:
                    "Unable to connect to the server. Please try again.",
            },

            register: {
                createAccount: "Create account",
                description:
                    "Create your account to get started",
                fullName: "Full Name",
                fullNamePlaceholder:
                    "Enter your full name",
                email: "Email",
                emailPlaceholder: "Enter your email",
                phone: "Phone Number",
                phonePlaceholder:
                    "Enter your phone number",
                password: "Password",
                passwordPlaceholder:
                    "Enter your password",
                passwordMustContain:
                    "Password must contain:",
                minLength: "At least 8 characters",
                uppercase: "One uppercase letter",
                number: "One number",
                special: "One special character",
                confirmPassword: "Confirm Password",
                confirmPasswordPlaceholder:
                    "Confirm your password",
                agreeTo: "I agree to",
                terms: "Terms & Conditions",
                createAccountButton:
                    "Create Account",
                creatingAccount:
                    "Creating Account...",
                orContinueWith: "OR CONTINUE WITH",
                continueWithGoogle:
                    "Continue with Google",
                continueWithInstagram:
                    "Continue with Instagram",
                alreadyHaveAccount:
                    "Already have an account?",
                signIn: "Sign in",
                fillAllFields:
                    "Please fill in all fields.",
                passwordsDoNotMatch:
                    "Passwords do not match.",
                passwordRequirements:
                    "Password does not meet the requirements.",
                acceptTerms:
                    "You must accept the Terms & Conditions.",
                registrationFailed:
                    "Registration failed.",
                unableToCreate:
                    "Unable to create your account.",
            },

            forgotPassword: {
                title: "Forgot password?",
                description:
                    "Enter your email and we'll send you a reset link.",
                email: "Email",
                emailPlaceholder: "Enter your email",
                sendResetLink: "Send Reset Link",
                success:
                    "If an account exists with this email, you will receive a password reset link.",
                required:
                    "Please enter your email address",
                rememberPassword:
                    "Remember your password?",
                signIn: "Sign in",
            },
        },

        header: {
            search: "Search...",
            searchAria: "Search",
            doctor: "Doctor",
            notifications: "Notifications",
            switchToArabic: "Switch to Arabic",
            switchToEnglish: "Switch to English",
            arabic: "العربية",
            english: "English",
            lightMode: "Light mode",
            darkMode: "Dark mode",
            switchToLight: "Switch to light mode",
            switchToDark: "Switch to dark mode",
        },

        dashboard: {
            eyebrow: "Doctor Dashboard",
            greeting: "Good to see you 👋",
            description:
                "Here’s an overview of your appointments and activity.",
            totalAppointments: "Total Appointments",
            todayAppointments:
                "Today's Appointments",
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            overviewTitle: "Appointment Overview",
            overviewDescription:
                "Current appointment status summary",
            loading: "Loading dashboard...",
            failed: "Failed to load dashboard.",
            tryAgain: "Try Again",
            refresh: "Refresh dashboard",
        },

        sidebar: {
            dashboard: "Dashboard",
            appointments: "Appointments",
            patients: "Patients",
            medicalRecords: "Medical Records",
            prescriptions: "Prescriptions",
            workingHours: "Working Hours",
            profile: "Profile",
            doctorPortal: "Doctor Portal",
            doctor: "Doctor",
            mainMenu: "MAIN MENU",
            logout: "Logout",
            closeMenu: "Close menu",
        },

        appointments: {
            eyebrow: "Appointments",
            title: "Manage Appointments",
            description:
                "View and manage your upcoming and previous patient appointments.",
            refresh: "Refresh appointments",
            filters: "Filters",
            status: "Status",
            date: "Date",
            time: "Time",
            type: "Type",
            duration: "Duration",
            reason: "Reason",
            allStatuses: "All statuses",
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled",
            clearFilters: "Clear filters",
            loading: "Loading appointments...",
            failed:
                "Failed to load appointments.",
            updateFailed:
                "Failed to update appointment status.",
            tryAgain: "Try Again",
            emptyTitle:
                "No appointments found",
            emptyDescription:
                "There are no appointments matching your current filters.",
            unknownPatient:
                "Unknown Patient",
            confirm: "Confirm",
            cancel: "Cancel",
            markCompleted:
                "Mark as Completed",
            minutes: "min",

            types: {
                consultation: "Consultation",
                cleaning: "Cleaning",
                orthodontics: "Orthodontics",
                whitening: "Whitening",
                treatment: "Treatment",
            },
        },

        patients: {
            eyebrow: "Patients",
            title: "My Patients",
            description:
                "View and manage patients who have appointments with you.",
            refresh: "Refresh patients",
            totalPatients: "Total Patients",
            searchPlaceholder:
                "Search by name, email or phone...",
            patient: "patient",
            patients: "patients",
            loading: "Loading patients...",
            failed: "Failed to load patients.",
            tryAgain: "Try Again",
            noPatientsFound:
                "No patients found",
            noPatientsYet:
                "No patients yet",
            noPatientsFoundDescription:
                "Try searching with a different name, email or phone number.",
            noPatientsYetDescription:
                "Patients who book appointments with you will appear here.",
            unknownPatient:
                "Unknown Patient",
            patientId: "Patient",
            noPhone: "No phone number",
            noEmail: "No email address",
            dateOfBirth: "Date of Birth",
            gender: "Gender",
            notSpecified: "Not specified",
            appointmentsWithYou:
                "Appointments with you",
        },

        // =========================
        // DOCTOR MEDICAL RECORDS
        // =========================

        medicalRecords: {
            eyebrow: "Medical Records",
            title: "Medical Records",
            description:
                "Review and manage medical records for your patients.",
            refresh: "Refresh records",
            newRecord: "New Record",
            totalRecords:
                "Total Medical Records",
            searchPlaceholder:
                "Search by patient, diagnosis or treatment...",
            record: "record",
            records: "records",
            loading:
                "Loading medical records...",
            failed:
                "Failed to load medical records.",
            formDataFailed:
                "Failed to load patients and appointments.",
            tryAgain: "Try Again",
            noRecordsFound:
                "No records found",
            noRecordsYet:
                "No medical records yet",
            noRecordsFoundDescription:
                "Try searching with a different keyword.",
            noRecordsYetDescription:
                "Medical records you create for your patients will appear here.",
            createFirstRecord:
                "Create First Record",
            unknownPatient:
                "Unknown Patient",
            recordNumber: "Record #",
            edit: "Edit record",
            delete: "Delete record",
            diagnosis: "Diagnosis",
            treatment: "Treatment",
            notes: "Notes",
            noDiagnosis:
                "No diagnosis recorded.",
            noTreatment:
                "No treatment recorded.",
            appointment: "Appointment",
            noDate: "No date",
            noTime: "No time",
            updateRecord: "Update Record",
            newMedicalRecord:
                "New Medical Record",
            editMedicalRecord:
                "Edit Medical Record",
            createMedicalRecord:
                "Create Medical Record",
            loadingFormData:
                "Loading patients and appointments...",
            patient: "Patient",
            selectPatient:
                "Select a patient",
            selectPatientFirst:
                "Select a patient first",
            noAppointments:
                "No appointments found",
            selectAppointment:
                "Select an appointment",
            diagnosisPlaceholder:
                "Enter diagnosis",
            treatmentPlaceholder:
                "Describe the treatment...",
            notesPlaceholder:
                "Additional notes...",
            cancel: "Cancel",
            saving: "Saving...",
            selectPatientError:
                "Please select a patient.",
            checkData:
                "Please check the entered data.",
            saveFailed:
                "Failed to save medical record.",
            thisPatient: "this patient",
            deleteConfirm:
                "Are you sure you want to delete the medical record for",
            deleteFailed:
                "Failed to delete medical record.",
            createRecord:
                "Create Record",
        },

        // =========================
        // DOCTOR PRESCRIPTIONS
        // =========================

        prescriptions: {
            eyebrow: "Prescriptions",
            title: "Prescriptions",
            description:
                "Manage prescriptions for your patients.",
            refresh: "Refresh",
            newPrescription:
                "New Prescription",
            totalPrescriptions:
                "Total Prescriptions",
            patients: "Patients",
            searchPlaceholder:
                "Search patient or medicine...",
            prescription: "prescription",
            prescriptions: "prescriptions",
            retry: "Retry",
            loading:
                "Loading prescriptions...",
            noPrescriptionsFound:
                "No prescriptions found",
            noPrescriptionsYet:
                "No prescriptions yet",
            searchEmpty:
                "Try a different search term.",
            createFirst:
                "Create your first prescription for a patient.",
            edit: "Edit prescription",
            delete: "Delete prescription",
            medicines: "Medicines",
            dosage: "Dosage",
            frequency: "Frequency",
            duration: "Duration",
            instructions: "Instructions",
            editPrescription:
                "Edit Prescription",
            modalDescription:
                "Add medication details for the patient.",
            loadingFormData:
                "Loading patients and appointments...",
            patient: "Patient",
            selectPatient:
                "Select a patient",
            appointment: "Appointment",
            selectPatientFirst:
                "Select a patient first",
            noAppointments:
                "No appointments found",
            selectAppointment:
                "Select an appointment",
            medicinesDescription:
                "Add one or more medicines to this prescription.",
            addMedicine:
                "Add Medicine",
            medicineNumber:
                "Medicine",
            medicationDetails:
                "Medication details",
            removeMedicine:
                "Remove medicine",
            medicine: "Medicine",
            medicinePlaceholder:
                "e.g. Amoxicillin 500mg",
            dosagePlaceholder:
                "e.g. 1 tablet",
            frequencyPlaceholder:
                "e.g. 3 times daily",
            durationPlaceholder:
                "e.g. 7 days",
            instructionsPlaceholder:
                "Write any instructions for the patient...",
            cancel: "Cancel",
            saving: "Saving...",
            updatePrescription:
                "Update Prescription",
            createPrescription:
                "Create Prescription",
            selectPatientError:
                "Please select a patient.",
            addMedicineError:
                "Please add at least one medicine.",
            medicineNameError:
                "Please enter the medicine name for every item.",
            saveFailed:
                "Unable to save prescription. Please try again.",
            deleteConfirm:
                "Are you sure you want to delete this prescription?",
            deleteFailed:
                "Unable to delete prescription.",
            unknownPatient:
                "Unknown Patient",
        },

        workingHours: {
            title: "Working Hours",
            description:
                "Manage your weekly availability and appointment schedule.",
            refresh: "Refresh",
            addWorkingHours:
                "Add Working Hours",
            configuredDays:
                "Configured Days",
            activeDays:
                "Active Days",
            weeklyHours:
                "Weekly Hours",
            weeklySchedule:
                "Weekly Schedule",
            scheduleDescription:
                "Your current availability for patient appointments.",

            day: "day",
            daysCount: "days",

            loading:
                "Loading your working hours...",
            noHoursConfigured:
                "No working hours configured",
            noHoursDescription:
                "Add your weekly availability so patients can book appointments with you.",
            weeklyScheduleShort:
                "Weekly schedule",
            active: "Active",
            inactive: "Inactive",
            start: "Start",
            end: "End",
            startTime: "Start Time",
            endTime: "End Time",
            edit: "Edit",
            delete: "Delete",
            deleting: "Deleting...",
            editWorkingHours:
                "Edit Working Hours",
            modalDescription:
                "Set your availability for a specific day.",
            selectDay:
                "Select a day",
            activeWorkingHours:
                "Active working hours",
            activeWorkingHoursDescription:
                "Patients can book appointments during this time.",
            cancel: "Cancel",
            saving: "Saving...",
            saveChanges:
                "Save Changes",
            updatedSuccess:
                "Working hours updated successfully.",
            addedSuccess:
                "Working hours added successfully.",
            deletedSuccess:
                "Working hours deleted successfully.",
            loadFailed:
                "Unable to load your working hours.",
            somethingWentWrong:
                "Something went wrong. Please try again.",
            deleteConfirm:
                "Are you sure you want to delete",
            unknownDay: "Unknown",
            invalidTime: "Invalid time",
            hoursShort: "h",
            minutesShort: "m",

            validation: {
                day:
                    "Please select a day.",
                bothTimes:
                    "Please enter both start and end times.",
                endAfterStart:
                    "End time must be later than start time.",
                duplicate:
                    "Working hours for this day already exist.",
            },

            days: {
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                sunday: "Sunday",
            },
        },

        doctorProfile: {
            title: "Doctor Profile",
            description:
                "Manage your professional profile and account information.",
            refresh: "Refresh",
            editProfile:
                "Edit Profile",

            loading:
                "Loading your profile...",
            loadFailed:
                "Unable to load your profile. Please try again.",
            somethingWentWrong:
                "Something went wrong. Please try again.",

            nameRequired:
                "Name is required.",
            specializationRequired:
                "Specialization is required.",

            updateSuccess:
                "Your profile has been updated successfully.",

            doctor: "Doctor",
            active: "Active",
            noEmail:
                "No email available",
            dentalSpecialist:
                "Dental Specialist",
            accountType:
                "ACCOUNT TYPE",

            professionalInformation:
                "Professional Information",

            professionalDescription:
                "Your basic doctor account information.",

            fullName: "Full Name",
            emailAddress:
                "Email Address",

            emailCannotChange:
                "Email cannot be changed from this page.",

            specialization:
                "Specialization",

            specializationPlaceholder:
                "e.g. General Dentistry",

            cancel: "Cancel",
            saving: "Saving...",
            saveChanges:
                "Save Changes",

            weeklyAvailability:
                "Weekly Availability",

            weeklyDescription:
                "Your active working hours during the week.",

            noActiveHours:
                "No active working hours",

            noActiveHoursDescription:
                "Configure your working hours so patients can book appointments.",

            unknown: "Unknown",

            days: {
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                sunday: "Sunday",
            },
        },

        notifications: {
            title: "Notifications",

            description:
                "Stay updated with your appointments and treatment.",

            totalNotifications:
                "Total Notifications",

            unread:
                "Unread",

            recentNotifications:
                "Recent Notifications",

            recentDescription:
                "Your latest account and treatment updates.",

            new:
                "New",

            markAllAsRead:
                "Mark All as Read",

            marking:
                "Marking...",

            markAsRead:
                "Mark as Read",

            delete:
                "Delete",

            loading:
                "Loading Notifications...",

            loadingDescription:
                "Please wait while we load your latest notifications.",

            noNotifications:
                "No Notifications",

            noNotificationsDescription:
                "You don't have any notifications right now.",

            unableToLoad:
                "Unable to load notifications.",

            unableToMarkRead:
                "Unable to mark notification as read.",

            unableToMarkAllRead:
                "Unable to mark all notifications as read.",

            notification:
                "Notification",
        },

        patientDashboard: {
            welcome: "Welcome back,",
            welcomeDescription:
                "Here’s an overview of your dental care.",

            patient: "Patient",
            doctor: "Doctor",
            dentalSpecialist:
                "Dental Specialist",

            loading:
                "Loading your dashboard...",
            loadFailed:
                "Unable to load your dashboard. Please try again.",
            tryAgain: "Try again",

            upcoming: "Upcoming",
            nextAppointment:
                "Next Appointment",

            date: "Date",
            time: "Time",
            status: "Status",

            viewAppointment:
                "View Appointment",

            noUpcomingAppointment:
                "You don't have any upcoming appointments.",

            bookAppointment:
                "Book Appointment",

            overview: "Overview",
            dentalCare: "Dental Care",

            appointments: "Appointments",
            medicalRecords:
                "Medical Records",
            prescriptions:
                "Prescriptions",

            quickActions:
                "Quick Actions",

            findDoctor:
                "Find a Doctor",
            findDoctorDescription:
                "Find the right dentist",

            bookAppointmentDescription:
                "Schedule a dental visit",

            medicalRecordsDescription:
                "View your medical records",

            dentalHealth:
                "Dental Health",
            dentalHealthDescription:
                "View your dental health",

            recentActivity:
                "Recent Activity",

            refresh: "Refresh",
            refreshing: "Refreshing...",

            notification:
                "Notification",
            newNotification:
                "You have a new notification.",

            noRecentActivity:
                "No recent activity.",

            statuses: {
                pending: "Pending",
                confirmed: "Confirmed",
                completed: "Completed",
                cancelled: "Cancelled",
            },
        },

        patientHome: {
            dashboard: "Dashboard",
            appointments: "Appointments",
            treatment: "Treatment",
            medicalRecords:
                "Medical Records",
            prescriptions:
                "Prescriptions",
            notifications:
                "Notifications",
            profile: "Profile",
            logout: "Logout",

            welcomeBack:
                "Welcome back",
            welcomeDescription:
                "Here’s an overview of your dental care.",
            patient: "Patient",

            nextAppointment:
                "Next Appointment",
            noUpcomingAppointment:
                "You don't have any upcoming appointments.",

            date: "Date",
            time: "Time",
            doctor: "Doctor",

            viewAppointments:
                "View Appointments",

            record: "record",
            records: "records",
            available: "available",

            recordsDescription:
                "Keep track of your dental medical records.",

            viewMedicalRecords:
                "View Medical Records",

            quickActions:
                "Quick Actions",

            bookAppointment:
                "Book Appointment",

            bookAppointmentDescription:
                "Schedule a dental visit",

            prescriptionsDescription:
                "View your prescriptions",

            profileDescription:
                "Manage your profile",

            recentActivity:
                "Recent Activity",

            appointment:
                "Appointment",
            completed:
                "Completed",
            confirmed:
                "Confirmed",
            with: "with Dr.",
            days: "days",
            ago: "ago",

            noRecentActivity:
                "No recent activity.",
        },

        patientAppointments: {
            title: "Appointments",
            description:
                "Manage your upcoming and previous appointments.",

            bookAppointment:
                "Book Appointment",

            upcoming:
                "Upcoming Appointments",

            previous:
                "Previous Appointments",

            upcomingAppointment:
                "Upcoming Appointment",

            loading:
                "Loading appointments...",

            noUpcoming:
                "No upcoming appointments",

            noUpcomingDescription:
                "You don't have any upcoming appointments.",

            viewDetails:
                "View Details",

            actions:
                "Appointment actions",

            cancelling:
                "Cancelling...",

            cancelAppointment:
                "Cancel Appointment",

            details:
                "Appointment Details",

            date: "Date",
            time: "Time",
            clinic: "Clinic",
            status: "Status",
            type: "Appointment Type",
            reason: "Appointment Reason",
            notes: "Notes",

            close: "Close",

            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled",
        },

        treatment: {
            title: "Treatment",
            description:
                "Track your dental treatment progress and history.",

            label: "Current Treatment",

            loading:
                "Loading treatment information...",

            noInformation:
                "No treatment information available",

            noInformationDescription:
                "Your treatment information will appear here once you have appointments or medical records.",

            currentTreatment:
                "Current Treatment",

            doctor: "Doctor",

            startDate:
                "Start Date",

            upcomingVisits:
                "Upcoming Visits",

            progress:
                "Treatment Progress",

            progressDescription:
                "Your treatment progress based on completed visits and medical records.",

            timeline:
                "Treatment Timeline",

            timelineDescription:
                "A chronological view of your appointments and treatment updates.",

            completed:
                "Completed",

            inProgress:
                "In Progress",

            upcoming:
                "Upcoming",

            noTimeline:
                "No treatment history",

            noTimelineDescription:
                "Your treatment history will appear here when updates are available.",

            information:
                "Treatment Information",

            informationDescription:
                "Treatment details are based on your appointments and medical records. Please contact your dentist if you have any questions about your treatment plan.",

            retry:
                "Try Again",
        },

        // =========================
        // PATIENT MEDICAL RECORDS
        // =========================

        patientMedicalRecords: {
            title: "Medical Records",
            description:
                "View your dental history, treatments and medical records.",

            totalRecords:
                "Total Records",

            treatments:
                "Treatments",

            lastVisit:
                "Last Visit",

            searchPlaceholder:
                "Search medical records...",

            medicalHistory:
                "Medical History",

            loading:
                "Loading medical records...",

            loadingDescription:
                "Please wait while we load your medical history.",

            unableToLoad:
                "Unable to load records",

            retry:
                "Try Again",

            noRecords:
                "No medical records yet",

            noRecordsDescription:
                "Your medical records will appear here after your doctor adds them.",

            noResults:
                "No records found",

            noResultsDescription:
                "Try searching with another keyword.",

            medicalRecord:
                "Medical Record",

            medical:
                "Medical",

            diagnosis:
                "Diagnosis",

            dentalDiagnosis:
                "Dental Diagnosis",

            treatment:
                "Treatment",

            dentalTreatment:
                "Dental Treatment",

            recordDetails:
                "Record Details",

            date:
                "Date",

            doctor:
                "Doctor",

            description:
                "Description",

            medicalNotes:
                "Medical Notes",

            close:
                "Close",

            unknownDoctor:
                "Unknown Doctor",

            unknownDate:
                "Unknown Date",

            recordDetailsAvailable:
                "Medical record details are available.",

            noAdditionalNotes:
                "No additional medical notes were provided.",
        },

        // =========================
        // PATIENT PRESCRIPTIONS
        // =========================

        patientPrescriptions: {
            title: "Prescriptions",

            description:
                "View your prescribed medications, instructions and treatment details.",

            totalPrescriptions:
                "Total Prescriptions",

            medications:
                "Medications",

            latestPrescription:
                "Latest Prescription",

            noPrescriptions:
                "No prescriptions",

            searchPlaceholder:
                "Search prescriptions...",

            yourPrescriptions:
                "Your Prescriptions",

            loading:
                "Loading prescriptions...",

            loadingDescription:
                "Please wait while we load your prescriptions.",

            unableToLoad:
                "Unable to load prescriptions",

            retry:
                "Try Again",

            noPrescriptionsDescription:
                "Your prescriptions will appear here after your doctor creates them.",

            noResults:
                "No prescriptions found",

            noResultsDescription:
                "Try searching with another keyword.",

            prescription:
                "Prescription",

            medicationCount:
                "{count} Medication | {count} Medications",

            issuedByDentist:
                "Prescription issued by your dentist.",

            viewDetails:
                "View Details",

            medicationDetails:
                "Medication Details",

            date:
                "Date",

            doctor:
                "Doctor",

            specialization:
                "Specialization",

            doctorNotes:
                "Doctor's Notes",

            noMedications:
                "No medications listed for this prescription.",

            unnamedMedication:
                "Unnamed Medication",

            dosage:
                "Dosage",

            frequency:
                "Frequency",

            duration:
                "Duration",

            instructions:
                "Instructions",

            unknownDoctor:
                "Unknown Doctor",

            unknownDate:
                "Unknown Date",

            close:
                "Close",
        },

        profile: {
            editProfile:
                "Edit Profile",
            cancel:
                "Cancel",
            saving:
                "Saving...",
            saveChanges:
                "Save Changes",

            profileUpdated:
                "Profile updated successfully.",

            patient:
                "Patient",
            noEmail:
                "No email available",

            personalInformation:
                "Personal Information",

            personalInformationDescription:
                "Your basic personal information.",

            fullName:
                "Full Name",
            emailAddress:
                "Email Address",
            phoneNumber:
                "Phone Number",
            dateOfBirth:
                "Date of Birth",
            gender:
                "Gender",
            address:
                "Address",

            selectGender:
                "Select gender",
            male:
                "Male",
            female:
                "Female",

            changePassword:
                "Change Password",

            changePasswordDescription:
                "Keep your account secure with a strong password.",

            currentPassword:
                "Current Password",
            newPassword:
                "New Password",
            confirmNewPassword:
                "Confirm New Password",

            enterCurrentPassword:
                "Enter current password",

            enterNewPassword:
                "Enter new password",

            confirmNewPasswordPlaceholder:
                "Confirm new password",

            showCurrentPassword:
                "Show current password",

            hideCurrentPassword:
                "Hide current password",

            showNewPassword:
                "Show new password",

            hideNewPassword:
                "Hide new password",

            showConfirmPassword:
                "Show confirmation password",

            hideConfirmPassword:
                "Hide confirmation password",

            updatePassword:
                "Update Password",

            updating:
                "Updating...",

            passwordChanged:
                "Password changed successfully.",

            currentPasswordRequired:
                "Please enter your current password.",

            newPasswordRequired:
                "Please enter your new password.",

            passwordMinLength:
                "New password must be at least 8 characters.",

            confirmPasswordRequired:
                "Please confirm your new password.",

            passwordsDoNotMatch:
                "New password and confirmation do not match.",

            notificationSettings:
                "Notification Settings",

            notificationSettingsDescription:
                "Choose how you want to receive notifications.",

            emailNotifications:
                "Email Notifications",

            emailNotificationsDescription:
                "Receive important updates by email.",

            appointmentReminders:
                "Appointment Reminders",

            appointmentRemindersDescription:
                "Receive reminders before your appointments.",

            toggleEmailNotifications:
                "Toggle email notifications",

            toggleAppointmentReminders:
                "Toggle appointment reminders",

            loading:
                "Loading profile...",

            unableToLoad:
                "Unable to load profile information.",

            unableToUpdate:
                "Unable to update profile.",

            unableToChangePassword:
                "Unable to change password.",
        },
    },

    ar: {
        auth: {
            login: {
                welcomeBack:
                    "مرحبًا بعودتك",
                description:
                    "سجّل الدخول لإدارة عيادتك السنية",
                email:
                    "البريد الإلكتروني",
                emailPlaceholder:
                    "أدخل بريدك الإلكتروني",
                password:
                    "كلمة المرور",
                passwordPlaceholder:
                    "أدخل كلمة المرور",
                rememberMe:
                    "تذكرني",
                forgotPassword:
                    "نسيت كلمة المرور؟",
                signIn:
                    "تسجيل الدخول",
                signingIn:
                    "جاري تسجيل الدخول...",
                orContinueWith:
                    "أو تابع باستخدام",
                continueWithGoogle:
                    "المتابعة باستخدام Google",
                continueWithInstagram:
                    "المتابعة باستخدام Instagram",
                noAccount:
                    "ليس لديك حساب؟",
                createAccount:
                    "إنشاء حساب",
                required:
                    "يرجى إدخال البريد الإلكتروني وكلمة المرور",
                unknownRole:
                    "دور المستخدم غير معروف.",
                invalidLogin:
                    "بيانات تسجيل الدخول غير صحيحة.",
                invalidCredentials:
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
                serverError:
                    "تعذر الاتصال بالخادم. حاول مرة أخرى.",
            },

            register: {
                createAccount:
                    "إنشاء حساب",
                description:
                    "أنشئ حسابك للبدء",
                fullName:
                    "الاسم الكامل",
                fullNamePlaceholder:
                    "أدخل اسمك الكامل",
                email:
                    "البريد الإلكتروني",
                emailPlaceholder:
                    "أدخل بريدك الإلكتروني",
                phone:
                    "رقم الهاتف",
                phonePlaceholder:
                    "أدخل رقم هاتفك",
                password:
                    "كلمة المرور",
                passwordPlaceholder:
                    "أدخل كلمة المرور",
                passwordMustContain:
                    "يجب أن تحتوي كلمة المرور على:",
                minLength:
                    "8 أحرف على الأقل",
                uppercase:
                    "حرف إنجليزي كبير واحد",
                number:
                    "رقم واحد على الأقل",
                special:
                    "رمز خاص واحد على الأقل",
                confirmPassword:
                    "تأكيد كلمة المرور",
                confirmPasswordPlaceholder:
                    "أكد كلمة المرور",
                agreeTo:
                    "أوافق على",
                terms:
                    "الشروط والأحكام",
                createAccountButton:
                    "إنشاء الحساب",
                creatingAccount:
                    "جاري إنشاء الحساب...",
                orContinueWith:
                    "أو تابع باستخدام",
                continueWithGoogle:
                    "المتابعة باستخدام Google",
                continueWithInstagram:
                    "المتابعة باستخدام Instagram",
                alreadyHaveAccount:
                    "لديك حساب بالفعل؟",
                signIn:
                    "تسجيل الدخول",
                fillAllFields:
                    "يرجى ملء جميع الحقول.",
                passwordsDoNotMatch:
                    "كلمتا المرور غير متطابقتين.",
                passwordRequirements:
                    "كلمة المرور لا تستوفي المتطلبات.",
                acceptTerms:
                    "يجب الموافقة على الشروط والأحكام.",
                registrationFailed:
                    "فشل إنشاء الحساب.",
                unableToCreate:
                    "تعذر إنشاء حسابك.",
            },

            forgotPassword: {
                title:
                    "نسيت كلمة المرور؟",
                description:
                    "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.",
                email:
                    "البريد الإلكتروني",
                emailPlaceholder:
                    "أدخل بريدك الإلكتروني",
                sendResetLink:
                    "إرسال رابط إعادة التعيين",
                success:
                    "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فستتلقى رابط إعادة تعيين كلمة المرور.",
                required:
                    "يرجى إدخال بريدك الإلكتروني",
                rememberPassword:
                    "تذكرت كلمة المرور؟",
                signIn:
                    "تسجيل الدخول",
            },
        },

        header: {
            search:
                "بحث...",
            searchAria:
                "بحث",
            doctor:
                "طبيب",
            notifications:
                "الإشعارات",
            switchToArabic:
                "التبديل إلى العربية",
            switchToEnglish:
                "التبديل إلى الإنجليزية",
            arabic:
                "العربية",
            english:
                "English",
            lightMode:
                "الوضع الفاتح",
            darkMode:
                "الوضع الداكن",
            switchToLight:
                "التبديل إلى الوضع الفاتح",
            switchToDark:
                "التبديل إلى الوضع الداكن",
        },

        dashboard: {
            eyebrow:
                "لوحة تحكم الطبيب",
            greeting:
                "سعيدون برؤيتك 👋",
            description:
                "إليك نظرة عامة على مواعيدك ونشاطك.",
            totalAppointments:
                "إجمالي المواعيد",
            todayAppointments:
                "مواعيد اليوم",
            pending:
                "قيد الانتظار",
            confirmed:
                "مؤكدة",
            completed:
                "مكتملة",
            overviewTitle:
                "نظرة عامة على المواعيد",
            overviewDescription:
                "ملخص الحالة الحالية للمواعيد",
            loading:
                "جاري تحميل لوحة التحكم...",
            failed:
                "فشل في تحميل لوحة التحكم.",
            tryAgain:
                "حاول مرة أخرى",
            refresh:
                "تحديث لوحة التحكم",
        },

        sidebar: {
            dashboard:
                "لوحة التحكم",
            appointments:
                "المواعيد",
            patients:
                "المرضى",
            medicalRecords:
                "السجلات الطبية",
            prescriptions:
                "الوصفات الطبية",
            workingHours:
                "ساعات العمل",
            profile:
                "الملف الشخصي",
            doctorPortal:
                "بوابة الطبيب",
            doctor:
                "طبيب",
            mainMenu:
                "القائمة الرئيسية",
            logout:
                "تسجيل الخروج",
            closeMenu:
                "إغلاق القائمة",
        },

        appointments: {
            eyebrow:
                "المواعيد",
            title:
                "إدارة المواعيد",
            description:
                "عرض وإدارة مواعيد المرضى القادمة والسابقة.",
            refresh:
                "تحديث المواعيد",
            filters:
                "الفلاتر",
            status:
                "الحالة",
            date:
                "التاريخ",
            time:
                "الوقت",
            type:
                "النوع",
            duration:
                "المدة",
            reason:
                "السبب",
            allStatuses:
                "جميع الحالات",
            pending:
                "قيد الانتظار",
            confirmed:
                "مؤكد",
            completed:
                "مكتمل",
            cancelled:
                "ملغى",
            clearFilters:
                "مسح الفلاتر",
            loading:
                "جاري تحميل المواعيد...",
            failed:
                "فشل في تحميل المواعيد.",
            updateFailed:
                "فشل في تحديث حالة الموعد.",
            tryAgain:
                "حاول مرة أخرى",
            emptyTitle:
                "لم يتم العثور على مواعيد",
            emptyDescription:
                "لا توجد مواعيد مطابقة للفلاتر الحالية.",
            unknownPatient:
                "مريض غير معروف",
            confirm:
                "تأكيد",
            cancel:
                "إلغاء",
            markCompleted:
                "تحديد كمكتمل",
            minutes:
                "دقيقة",

            types: {
                consultation:
                    "استشارة",
                cleaning:
                    "تنظيف",
                orthodontics:
                    "تقويم",
                whitening:
                    "تبييض",
                treatment:
                    "علاج",
            },
        },

        patients: {
            eyebrow:
                "المرضى",
            title:
                "مرضاي",
            description:
                "عرض وإدارة المرضى الذين لديهم مواعيد معك.",
            refresh:
                "تحديث المرضى",
            totalPatients:
                "إجمالي المرضى",
            searchPlaceholder:
                "البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف...",
            patient:
                "مريض",
            patients:
                "مرضى",
            loading:
                "جاري تحميل المرضى...",
            failed:
                "فشل في تحميل المرضى.",
            tryAgain:
                "حاول مرة أخرى",
            noPatientsFound:
                "لم يتم العثور على مرضى",
            noPatientsYet:
                "لا يوجد مرضى بعد",
            noPatientsFoundDescription:
                "حاول البحث باستخدام اسم أو بريد إلكتروني أو رقم هاتف مختلف.",
            noPatientsYetDescription:
                "المرضى الذين يحجزون مواعيد معك سيظهرون هنا.",
            unknownPatient:
                "مريض غير معروف",
            patientId:
                "مريض",
            noPhone:
                "لا يوجد رقم هاتف",
            noEmail:
                "لا يوجد بريد إلكتروني",
            dateOfBirth:
                "تاريخ الميلاد",
            gender:
                "الجنس",
            notSpecified:
                "غير محدد",
            appointmentsWithYou:
                "المواعيد معك",
        },

        // =========================
        // DOCTOR MEDICAL RECORDS
        // =========================

        medicalRecords: {
            eyebrow:
                "السجلات الطبية",
            title:
                "السجلات الطبية",
            description:
                "عرض وإدارة السجلات الطبية الخاصة بمرضاك.",
            refresh:
                "تحديث السجلات",
            newRecord:
                "سجل جديد",
            totalRecords:
                "إجمالي السجلات الطبية",
            searchPlaceholder:
                "البحث بالمريض أو التشخيص أو العلاج...",
            record:
                "سجل",
            records:
                "سجلات",
            loading:
                "جاري تحميل السجلات الطبية...",
            failed:
                "فشل في تحميل السجلات الطبية.",
            formDataFailed:
                "فشل في تحميل المرضى والمواعيد.",
            tryAgain:
                "حاول مرة أخرى",
            noRecordsFound:
                "لم يتم العثور على سجلات",
            noRecordsYet:
                "لا توجد سجلات طبية بعد",
            noRecordsFoundDescription:
                "حاول البحث باستخدام كلمة مفتاحية مختلفة.",
            noRecordsYetDescription:
                "السجلات الطبية التي تنشئها لمرضاك ستظهر هنا.",
            createFirstRecord:
                "إنشاء أول سجل",
            unknownPatient:
                "مريض غير معروف",
            recordNumber:
                "السجل رقم",
            edit:
                "تعديل السجل",
            delete:
                "حذف السجل",
            diagnosis:
                "التشخيص",
            treatment:
                "العلاج",
            notes:
                "الملاحظات",
            noDiagnosis:
                "لا يوجد تشخيص مسجل.",
            noTreatment:
                "لا يوجد علاج مسجل.",
            appointment:
                "الموعد",
            noDate:
                "لا يوجد تاريخ",
            noTime:
                "لا يوجد وقت",
            updateRecord:
                "تحديث السجل",
            newMedicalRecord:
                "سجل طبي جديد",
            editMedicalRecord:
                "تعديل السجل الطبي",
            createMedicalRecord:
                "إنشاء سجل طبي",
            loadingFormData:
                "جاري تحميل المرضى والمواعيد...",
            patient:
                "المريض",
            selectPatient:
                "اختر مريضًا",
            selectPatientFirst:
                "اختر المريض أولًا",
            noAppointments:
                "لا توجد مواعيد",
            selectAppointment:
                "اختر موعدًا",
            diagnosisPlaceholder:
                "أدخل التشخيص",
            treatmentPlaceholder:
                "اكتب تفاصيل العلاج...",
            notesPlaceholder:
                "ملاحظات إضافية...",
            cancel:
                "إلغاء",
            saving:
                "جاري الحفظ...",
            selectPatientError:
                "يرجى اختيار مريض.",
            checkData:
                "يرجى التحقق من البيانات المدخلة.",
            saveFailed:
                "فشل في حفظ السجل الطبي.",
            thisPatient:
                "هذا المريض",
            deleteConfirm:
                "هل أنت متأكد أنك تريد حذف السجل الطبي للمريض",
            deleteFailed:
                "فشل في حذف السجل الطبي.",
            createRecord:
                "إنشاء سجل",
        },

        // =========================
        // DOCTOR PRESCRIPTIONS
        // =========================

        prescriptions: {
            eyebrow:
                "الوصفات الطبية",
            title:
                "الوصفات الطبية",
            description:
                "إدارة الوصفات الطبية الخاصة بمرضاك.",
            refresh:
                "تحديث",
            newPrescription:
                "وصفة جديدة",
            totalPrescriptions:
                "إجمالي الوصفات",
            patients:
                "المرضى",
            searchPlaceholder:
                "البحث عن مريض أو دواء...",
            prescription:
                "وصفة",
            prescriptions:
                "وصفات",
            retry:
                "إعادة المحاولة",
            loading:
                "جاري تحميل الوصفات...",
            noPrescriptionsFound:
                "لم يتم العثور على وصفات",
            noPrescriptionsYet:
                "لا توجد وصفات بعد",
            searchEmpty:
                "حاول استخدام كلمة بحث مختلفة.",
            createFirst:
                "أنشئ أول وصفة طبية لأحد مرضاك.",
            edit:
                "تعديل الوصفة",
            delete:
                "حذف الوصفة",
            medicines:
                "الأدوية",
            dosage:
                "الجرعة",
            frequency:
                "التكرار",
            duration:
                "المدة",
            instructions:
                "التعليمات",
            editPrescription:
                "تعديل الوصفة الطبية",
            modalDescription:
                "أضف تفاصيل الأدوية الخاصة بالمريض.",
            loadingFormData:
                "جاري تحميل المرضى والمواعيد...",
            patient:
                "المريض",
            selectPatient:
                "اختر مريضًا",
            appointment:
                "الموعد",
            selectPatientFirst:
                "اختر المريض أولًا",
            noAppointments:
                "لا توجد مواعيد",
            selectAppointment:
                "اختر موعدًا",
            medicinesDescription:
                "أضف دواءً واحدًا أو أكثر إلى هذه الوصفة.",
            addMedicine:
                "إضافة دواء",
            medicineNumber:
                "الدواء",
            medicationDetails:
                "تفاصيل الدواء",
            removeMedicine:
                "حذف الدواء",
            medicine:
                "الدواء",
            medicinePlaceholder:
                "مثال: Amoxicillin 500mg",
            dosagePlaceholder:
                "مثال: قرص واحد",
            frequencyPlaceholder:
                "مثال: 3 مرات يوميًا",
            durationPlaceholder:
                "مثال: 7 أيام",
            instructionsPlaceholder:
                "اكتب أي تعليمات للمريض...",
            cancel:
                "إلغاء",
            saving:
                "جاري الحفظ...",
            updatePrescription:
                "تحديث الوصفة",
            createPrescription:
                "إنشاء الوصفة",
            selectPatientError:
                "يرجى اختيار مريض.",
            addMedicineError:
                "يرجى إضافة دواء واحد على الأقل.",
            medicineNameError:
                "يرجى إدخال اسم الدواء لكل عنصر.",
            saveFailed:
                "تعذر حفظ الوصفة. حاول مرة أخرى.",
            deleteConfirm:
                "هل أنت متأكد أنك تريد حذف هذه الوصفة؟",
            deleteFailed:
                "تعذر حذف الوصفة.",
            unknownPatient:
                "مريض غير معروف",
        },

        workingHours: {
            title:
                "ساعات العمل",

            description:
                "إدارة أوقات توفرك الأسبوعية وجدول المواعيد.",

            refresh:
                "تحديث",

            addWorkingHours:
                "إضافة ساعات عمل",

            configuredDays:
                "الأيام المحددة",

            activeDays:
                "الأيام النشطة",

            weeklyHours:
                "الساعات الأسبوعية",

            weeklySchedule:
                "الجدول الأسبوعي",

            scheduleDescription:
                "أوقات توفرك الحالية لحجز مواعيد المرضى.",

            day:
                "يوم",

            daysCount:
                "أيام",

            loading:
                "جاري تحميل ساعات العمل...",

            noHoursConfigured:
                "لم يتم تحديد ساعات العمل",

            noHoursDescription:
                "أضف أوقات توفرك الأسبوعية حتى يتمكن المرضى من حجز المواعيد معك.",

            weeklyScheduleShort:
                "الجدول الأسبوعي",

            active:
                "نشط",

            inactive:
                "غير نشط",

            start:
                "البداية",

            end:
                "النهاية",

            startTime:
                "وقت البداية",

            endTime:
                "وقت النهاية",

            edit:
                "تعديل",

            delete:
                "حذف",

            deleting:
                "جاري الحذف...",

            editWorkingHours:
                "تعديل ساعات العمل",

            modalDescription:
                "حدد أوقات توفرك ليوم معين.",

            selectDay:
                "اختر يومًا",

            activeWorkingHours:
                "ساعات العمل النشطة",

            activeWorkingHoursDescription:
                "يمكن للمرضى حجز المواعيد خلال هذا الوقت.",

            cancel:
                "إلغاء",

            saving:
                "جاري الحفظ...",

            saveChanges:
                "حفظ التغييرات",

            updatedSuccess:
                "تم تحديث ساعات العمل بنجاح.",

            addedSuccess:
                "تمت إضافة ساعات العمل بنجاح.",

            deletedSuccess:
                "تم حذف ساعات العمل بنجاح.",

            loadFailed:
                "تعذر تحميل ساعات العمل الخاصة بك.",

            somethingWentWrong:
                "حدث خطأ ما. حاول مرة أخرى.",

            deleteConfirm:
                "هل أنت متأكد أنك تريد حذف ساعات العمل ليوم",

            unknownDay:
                "غير معروف",

            invalidTime:
                "وقت غير صالح",

            hoursShort:
                "س",

            minutesShort:
                "د",

            validation: {
                day:
                    "يرجى اختيار يوم.",
                bothTimes:
                    "يرجى إدخال وقت البداية والنهاية.",
                endAfterStart:
                    "يجب أن يكون وقت النهاية بعد وقت البداية.",
                duplicate:
                    "ساعات العمل لهذا اليوم موجودة بالفعل.",
            },

            days: {
                monday:
                    "الاثنين",
                tuesday:
                    "الثلاثاء",
                wednesday:
                    "الأربعاء",
                thursday:
                    "الخميس",
                friday:
                    "الجمعة",
                saturday:
                    "السبت",
                sunday:
                    "الأحد",
            },
        },

        doctorProfile: {
            title:
                "الملف الشخصي للطبيب",

            description:
                "إدارة ملفك المهني ومعلومات حسابك.",

            refresh:
                "تحديث",

            editProfile:
                "تعديل الملف الشخصي",

            loading:
                "جاري تحميل ملفك الشخصي...",

            loadFailed:
                "تعذر تحميل ملفك الشخصي. حاول مرة أخرى.",

            somethingWentWrong:
                "حدث خطأ ما. حاول مرة أخرى.",

            nameRequired:
                "الاسم مطلوب.",

            specializationRequired:
                "الاختصاص مطلوب.",

            updateSuccess:
                "تم تحديث ملفك الشخصي بنجاح.",

            doctor:
                "طبيب",

            active:
                "نشط",

            noEmail:
                "لا يوجد بريد إلكتروني",

            dentalSpecialist:
                "اختصاص طب الأسنان",

            accountType:
                "نوع الحساب",

            professionalInformation:
                "المعلومات المهنية",

            professionalDescription:
                "معلومات حساب الطبيب الأساسية.",

            fullName:
                "الاسم الكامل",

            emailAddress:
                "البريد الإلكتروني",

            emailCannotChange:
                "لا يمكن تغيير البريد الإلكتروني من هذه الصفحة.",

            specialization:
                "الاختصاص",

            specializationPlaceholder:
                "مثال: طب الأسنان العام",

            cancel:
                "إلغاء",

            saving:
                "جاري الحفظ...",

            saveChanges:
                "حفظ التغييرات",

            weeklyAvailability:
                "أوقات الدوام الأسبوعية",

            weeklyDescription:
                "أوقات العمل النشطة الخاصة بك خلال الأسبوع.",

            noActiveHours:
                "لا توجد أوقات دوام نشطة",

            noActiveHoursDescription:
                "قم بإعداد أوقات دوامك حتى يتمكن المرضى من حجز المواعيد.",

            unknown:
                "غير معروف",

            days: {
                monday:
                    "الاثنين",
                tuesday:
                    "الثلاثاء",
                wednesday:
                    "الأربعاء",
                thursday:
                    "الخميس",
                friday:
                    "الجمعة",
                saturday:
                    "السبت",
                sunday:
                    "الأحد",
            },
        },

        notifications: {
            title:
                "الإشعارات",

            description:
                "ابقَ على اطلاع بآخر تحديثات مواعيدك وعلاجك.",

            totalNotifications:
                "إجمالي الإشعارات",

            unread:
                "غير المقروءة",

            recentNotifications:
                "آخر الإشعارات",

            recentDescription:
                "آخر التحديثات المتعلقة بحسابك وعلاجك.",

            new:
                "جديد",

            markAllAsRead:
                "تحديد الكل كمقروء",

            marking:
                "جاري التحديد...",

            markAsRead:
                "تحديد كمقروء",

            delete:
                "حذف",

            loading:
                "جاري تحميل الإشعارات...",

            loadingDescription:
                "يرجى الانتظار حتى يتم تحميل آخر إشعاراتك.",

            noNotifications:
                "لا توجد إشعارات",

            noNotificationsDescription:
                "ليس لديك أي إشعارات حالياً.",

            unableToLoad:
                "تعذر تحميل الإشعارات.",

            unableToMarkRead:
                "تعذر تحديد الإشعار كمقروء.",

            unableToMarkAllRead:
                "تعذر تحديد جميع الإشعارات كمقروءة.",

            notification:
                "إشعار",
        },

        patientDashboard: {
            welcome:
                "مرحباً بعودتك،",

            welcomeDescription:
                "إليك نظرة عامة على رعايتك السنية.",

            patient:
                "مريض",

            doctor:
                "الطبيب",

            dentalSpecialist:
                "اختصاص طب الأسنان",

            loading:
                "جاري تحميل لوحة التحكم...",

            loadFailed:
                "تعذر تحميل لوحة التحكم. حاول مرة أخرى.",

            tryAgain:
                "حاول مرة أخرى",

            upcoming:
                "القادم",

            nextAppointment:
                "الموعد القادم",

            date:
                "التاريخ",

            time:
                "الوقت",

            status:
                "الحالة",

            viewAppointment:
                "عرض الموعد",

            noUpcomingAppointment:
                "ليس لديك أي مواعيد قادمة.",

            bookAppointment:
                "حجز موعد",

            overview:
                "نظرة عامة",

            dentalCare:
                "الرعاية السنية",

            appointments:
                "المواعيد",

            medicalRecords:
                "السجلات الطبية",

            prescriptions:
                "الوصفات الطبية",

            quickActions:
                "إجراءات سريعة",

            findDoctor:
                "البحث عن طبيب",

            findDoctorDescription:
                "اعثر على طبيب الأسنان المناسب",

            bookAppointmentDescription:
                "احجز زيارة لعيادة الأسنان",

            medicalRecordsDescription:
                "عرض سجلاتك الطبية",

            dentalHealth:
                "صحة الأسنان",

            dentalHealthDescription:
                "عرض حالة صحة أسنانك",

            recentActivity:
                "النشاط الأخير",

            refresh:
                "تحديث",

            refreshing:
                "جاري التحديث...",

            notification:
                "إشعار",

            newNotification:
                "لديك إشعار جديد.",

            noRecentActivity:
                "لا يوجد نشاط حديث.",

            statuses: {
                pending:
                    "قيد الانتظار",

                confirmed:
                    "مؤكد",

                completed:
                    "مكتمل",

                cancelled:
                    "ملغى",
            },
        },

        patientHome: {
            dashboard:
                "لوحة التحكم",

            appointments:
                "المواعيد",

            treatment:
                "العلاجات",

            medicalRecords:
                "السجلات الطبية",

            prescriptions:
                "الوصفات الطبية",

            notifications:
                "الإشعارات",

            profile:
                "الملف الشخصي",

            logout:
                "تسجيل الخروج",

            welcomeBack:
                "مرحباً بعودتك",

            welcomeDescription:
                "إليك نظرة عامة على رعايتك السنية.",

            patient:
                "مريض",

            nextAppointment:
                "الموعد القادم",

            noUpcomingAppointment:
                "ليس لديك أي مواعيد قادمة.",

            date:
                "التاريخ",

            time:
                "الوقت",

            doctor:
                "الطبيب",

            viewAppointments:
                "عرض المواعيد",

            record:
                "سجل",

            records:
                "سجلات",

            available:
                "متاحة",

            recordsDescription:
                "تابع سجلاتك الطبية السنية.",

            viewMedicalRecords:
                "عرض السجلات الطبية",

            quickActions:
                "إجراءات سريعة",

            bookAppointment:
                "حجز موعد",

            bookAppointmentDescription:
                "احجز زيارة لعيادة الأسنان",

            prescriptionsDescription:
                "عرض وصفاتك الطبية",

            profileDescription:
                "إدارة ملفك الشخصي",

            recentActivity:
                "النشاط الأخير",

            appointment:
                "موعد",

            completed:
                "مكتمل",

            confirmed:
                "مؤكد",

            with:
                "مع د. ",

            days:
                "أيام",

            ago:
                "مضت",

            noRecentActivity:
                "لا يوجد نشاط حديث.",
        },

        patientAppointments: {
            title:
                "المواعيد",

            description:
                "إدارة مواعيدك القادمة والسابقة.",

            bookAppointment:
                "حجز موعد",

            upcoming:
                "المواعيد القادمة",

            previous:
                "المواعيد السابقة",

            upcomingAppointment:
                "الموعد القادم",

            loading:
                "جاري تحميل المواعيد...",

            noUpcoming:
                "لا توجد مواعيد قادمة",

            noUpcomingDescription:
                "ليس لديك أي مواعيد قادمة.",

            viewDetails:
                "عرض التفاصيل",

            actions:
                "إجراءات الموعد",

            cancelling:
                "جاري الإلغاء...",

            cancelAppointment:
                "إلغاء الموعد",

            details:
                "تفاصيل الموعد",

            date:
                "التاريخ",

            time:
                "الوقت",

            clinic:
                "العيادة",

            status:
                "الحالة",

            type:
                "نوع الموعد",

            reason:
                "سبب الموعد",

            notes:
                "ملاحظات",

            close:
                "إغلاق",

            pending:
                "قيد الانتظار",

            confirmed:
                "مؤكد",

            completed:
                "مكتمل",

            cancelled:
                "ملغى",
        },

        treatment: {
            title:
                "العلاج",

            description:
                "تابع تقدم علاجك السني وسجل مواعيدك وتحديثاتك العلاجية.",

            label:
                "العلاج الحالي",

            loading:
                "جاري تحميل معلومات العلاج...",

            noInformation:
                "لا توجد معلومات عن العلاج",

            noInformationDescription:
                "ستظهر معلومات علاجك هنا عند توفر مواعيد أو سجلات طبية.",

            currentTreatment:
                "العلاج الحالي",

            doctor:
                "الطبيب",

            startDate:
                "تاريخ البدء",

            upcomingVisits:
                "الزيارات القادمة",

            progress:
                "تقدم العلاج",

            progressDescription:
                "يتم حساب تقدم العلاج بناءً على الزيارات المكتملة والسجلات الطبية.",

            timeline:
                "سجل العلاج",

            timelineDescription:
                "عرض زمني لمواعيدك وتحديثات علاجك.",

            completed:
                "مكتمل",

            inProgress:
                "قيد التنفيذ",

            upcoming:
                "قادم",

            noTimeline:
                "لا يوجد سجل للعلاج",

            noTimelineDescription:
                "سيظهر سجل علاجك هنا عند توفر تحديثات جديدة.",

            information:
                "معلومات العلاج",

            informationDescription:
                "تعتمد تفاصيل العلاج على مواعيدك وسجلاتك الطبية. يرجى التواصل مع طبيب الأسنان إذا كان لديك أي استفسار حول خطة العلاج.",

            retry:
                "حاول مرة أخرى",
        },

        // =========================
        // PATIENT MEDICAL RECORDS
        // =========================

        patientMedicalRecords: {
            title:
                "السجلات الطبية",

            description:
                "عرض تاريخك السني وعلاجاتك وسجلاتك الطبية.",

            totalRecords:
                "إجمالي السجلات",

            treatments:
                "العلاجات",

            lastVisit:
                "آخر زيارة",

            searchPlaceholder:
                "البحث في السجلات الطبية...",

            medicalHistory:
                "السجل الطبي",

            loading:
                "جاري تحميل السجلات الطبية...",

            loadingDescription:
                "يرجى الانتظار حتى يتم تحميل سجلك الطبي.",

            unableToLoad:
                "تعذر تحميل السجلات",

            retry:
                "حاول مرة أخرى",

            noRecords:
                "لا توجد سجلات طبية بعد",

            noRecordsDescription:
                "ستظهر سجلاتك الطبية هنا بعد أن يضيفها طبيبك.",

            noResults:
                "لم يتم العثور على سجلات",

            noResultsDescription:
                "جرّب البحث باستخدام كلمة أخرى.",

            medicalRecord:
                "سجل طبي",

            medical:
                "طبي",

            diagnosis:
                "التشخيص",

            dentalDiagnosis:
                "تشخيص سني",

            treatment:
                "العلاج",

            dentalTreatment:
                "علاج سني",

            recordDetails:
                "تفاصيل السجل",

            date:
                "التاريخ",

            doctor:
                "الطبيب",

            description:
                "الوصف",

            medicalNotes:
                "الملاحظات الطبية",

            close:
                "إغلاق",

            unknownDoctor:
                "طبيب غير معروف",

            unknownDate:
                "تاريخ غير معروف",

            recordDetailsAvailable:
                "تفاصيل السجل الطبي متاحة.",

            noAdditionalNotes:
                "لم تتم إضافة ملاحظات طبية إضافية.",
        },

        // =========================
        // PATIENT PRESCRIPTIONS
        // =========================

        patientPrescriptions: {
            title:
                "الوصفات الطبية",

            description:
                "عرض الأدوية الموصوفة لك وتعليمات استخدامها وتفاصيل العلاج.",

            totalPrescriptions:
                "إجمالي الوصفات",

            medications:
                "الأدوية",

            latestPrescription:
                "آخر وصفة",

            noPrescriptions:
                "لا توجد وصفات",

            searchPlaceholder:
                "البحث في الوصفات الطبية...",

            yourPrescriptions:
                "وصفاتك الطبية",

            loading:
                "جاري تحميل الوصفات الطبية...",

            loadingDescription:
                "يرجى الانتظار حتى يتم تحميل وصفاتك الطبية.",

            unableToLoad:
                "تعذر تحميل الوصفات الطبية",

            retry:
                "حاول مرة أخرى",

            noPrescriptionsDescription:
                "ستظهر وصفاتك الطبية هنا بعد أن يقوم طبيبك بإنشائها.",

            noResults:
                "لم يتم العثور على وصفات",

            noResultsDescription:
                "جرّب البحث باستخدام كلمة أخرى.",

            prescription:
                "وصفة طبية",

            medicationCount:
                "{count} دواء",

            issuedByDentist:
                "تم إصدار هذه الوصفة من قبل طبيب الأسنان.",

            viewDetails:
                "عرض التفاصيل",

            medicationDetails:
                "تفاصيل الأدوية",

            date:
                "التاريخ",

            doctor:
                "الطبيب",

            specialization:
                "الاختصاص",

            doctorNotes:
                "ملاحظات الطبيب",

            noMedications:
                "لا توجد أدوية مدرجة في هذه الوصفة.",

            unnamedMedication:
                "دواء غير محدد",

            dosage:
                "الجرعة",

            frequency:
                "التكرار",

            duration:
                "المدة",

            instructions:
                "التعليمات",

            unknownDoctor:
                "طبيب غير معروف",

            unknownDate:
                "تاريخ غير معروف",

            close:
                "إغلاق",
        },

        profile: {
            editProfile:
                "تعديل الملف الشخصي",

            cancel:
                "إلغاء",

            saving:
                "جاري الحفظ...",

            saveChanges:
                "حفظ التغييرات",

            profileUpdated:
                "تم تحديث الملف الشخصي بنجاح.",

            patient:
                "مريض",

            noEmail:
                "لا يوجد بريد إلكتروني",

            personalInformation:
                "المعلومات الشخصية",

            personalInformationDescription:
                "معلوماتك الشخصية الأساسية.",

            fullName:
                "الاسم الكامل",

            emailAddress:
                "البريد الإلكتروني",

            phoneNumber:
                "رقم الهاتف",

            dateOfBirth:
                "تاريخ الميلاد",

            gender:
                "الجنس",

            address:
                "العنوان",

            selectGender:
                "اختر الجنس",

            male:
                "ذكر",

            female:
                "أنثى",

            changePassword:
                "تغيير كلمة المرور",

            changePasswordDescription:
                "حافظ على أمان حسابك باستخدام كلمة مرور قوية.",

            currentPassword:
                "كلمة المرور الحالية",

            newPassword:
                "كلمة المرور الجديدة",

            confirmNewPassword:
                "تأكيد كلمة المرور الجديدة",

            enterCurrentPassword:
                "أدخل كلمة المرور الحالية",

            enterNewPassword:
                "أدخل كلمة المرور الجديدة",

            confirmNewPasswordPlaceholder:
                "أكد كلمة المرور الجديدة",

            showCurrentPassword:
                "إظهار كلمة المرور الحالية",

            hideCurrentPassword:
                "إخفاء كلمة المرور الحالية",

            showNewPassword:
                "إظهار كلمة المرور الجديدة",

            hideNewPassword:
                "إخفاء كلمة المرور الجديدة",

            showConfirmPassword:
                "إظهار كلمة مرور التأكيد",

            hideConfirmPassword:
                "إخفاء كلمة مرور التأكيد",

            updatePassword:
                "تحديث كلمة المرور",

            updating:
                "جاري التحديث...",

            passwordChanged:
                "تم تغيير كلمة المرور بنجاح.",

            currentPasswordRequired:
                "يرجى إدخال كلمة المرور الحالية.",

            newPasswordRequired:
                "يرجى إدخال كلمة المرور الجديدة.",

            passwordMinLength:
                "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.",

            confirmPasswordRequired:
                "يرجى تأكيد كلمة المرور الجديدة.",

            passwordsDoNotMatch:
                "كلمة المرور الجديدة وتأكيدها غير متطابقين.",

            notificationSettings:
                "إعدادات الإشعارات",

            notificationSettingsDescription:
                "اختر الطريقة التي تريد من خلالها تلقي الإشعارات.",

            emailNotifications:
                "إشعارات البريد الإلكتروني",

            emailNotificationsDescription:
                "تلقي التحديثات المهمة عبر البريد الإلكتروني.",

            appointmentReminders:
                "تذكيرات المواعيد",

            appointmentRemindersDescription:
                "تلقي تذكيرات قبل مواعيدك.",

            toggleEmailNotifications:
                "تفعيل أو تعطيل إشعارات البريد الإلكتروني",

            toggleAppointmentReminders:
                "تفعيل أو تعطيل تذكيرات المواعيد",

            loading:
                "جاري تحميل الملف الشخصي...",

            unableToLoad:
                "تعذر تحميل معلومات الملف الشخصي.",

            unableToUpdate:
                "تعذر تحديث الملف الشخصي.",

            unableToChangePassword:
                "تعذر تغيير كلمة المرور.",
        },
    },
};

const LANGUAGE_CONFIG = {
    en: {
        direction: "ltr",
        locale: "en",
    },

    ar: {
        direction: "rtl",
        locale: "ar",
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const savedLanguage =
            localStorage.getItem("language");

        if (
            savedLanguage === "ar" ||
            savedLanguage === "en"
        ) {
            return savedLanguage;
        }

        return "en";
    });

    useEffect(() => {
        const config = LANGUAGE_CONFIG[language];

        document.documentElement.lang =
            config.locale;

        document.documentElement.dir =
            config.direction;

        localStorage.setItem(
            "language",
            language
        );
    }, [language]);

    const direction =
        LANGUAGE_CONFIG[language].direction;

    const isRTL =
        direction === "rtl";

    const toggleLanguage = () => {
        setLanguage(
            (currentLanguage) =>
                currentLanguage === "en"
                    ? "ar"
                    : "en"
        );
    };

    const t = (key) => {
        const keys = key.split(".");
        let value = translations[language];

        for (const item of keys) {
            value = value?.[item];
        }

        if (typeof value === "string") {
            return value;
        }

        console.error(
            "Translation key does not return a string:",
            key,
            value
        );

        return key;
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        direction,
        isRTL,
        isLTR: !isRTL,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context =
        useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}