import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ROLE_HOME = {
    patient: "/patient",
    doctor: "/doctor",
    receptionist: "/receptionist",
};

function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | Authentication Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading-spinner"></div>

                <p>Loading...</p>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not Authenticated
    |--------------------------------------------------------------------------
    */

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Role Authorization
    |--------------------------------------------------------------------------
    */

    if (
        allowedRoles?.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {
        const roleHome = ROLE_HOME[user.role];

        if (roleHome) {
            return (
                <Navigate
                    to={roleHome}
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Authorized
    |--------------------------------------------------------------------------
    */

    return <Outlet />;
}

export default ProtectedRoute;
