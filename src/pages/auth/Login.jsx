import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FiInstagram } from "react-icons/fi";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError(t("auth.login.required"));
            return;
        }

        setError("");
        setLoading(true);

        try {
            const user = await login(email, password);

            if (user.role === "patient") {
                navigate("/patient");
            } else if (user.role === "doctor") {
                navigate("/doctor");
            } else if (user.role === "receptionist") {
                navigate("/receptionist");
            } else {
                setError(t("auth.login.unknownRole"));
            }
        } catch (error) {
            const response = error.response;

            if (response?.status === 422) {
                setError(
                    response.data?.errors?.email?.[0] ||
                    response.data?.message ||
                    t("auth.login.invalidLogin")
                );
            } else if (response?.status === 401) {
                setError(
                    response.data?.message ||
                    t("auth.login.invalidCredentials")
                );
            } else {
                setError(
                    t("auth.login.serverError")
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="logo">🦷</div>

                    <h1>
                        {t("auth.login.welcomeBack")}
                    </h1>

                    <p>
                        {t("auth.login.description")}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <Input
                        label={t("auth.login.email")}
                        type="email"
                        placeholder={t(
                            "auth.login.emailPlaceholder"
                        )}
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        disabled={loading}
                    />

                    <Input
                        label={t("auth.login.password")}
                        type="password"
                        placeholder={t(
                            "auth.login.passwordPlaceholder"
                        )}
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        disabled={loading}
                    />

                    <div className="remember-row">

                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                {t(
                                    "auth.login.rememberMe"
                                )}
                            </span>
                        </label>

                        <Link to="/forgot-password">
                            {t(
                                "auth.login.forgotPassword"
                            )}
                        </Link>
                    </div>

                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? t("auth.login.signingIn")
                            : t("auth.login.signIn")}
                    </Button>
                </form>

                <div className="divider">
                    <span>
                        {t(
                            "auth.login.orContinueWith"
                        )}
                    </span>
                </div>

                <div className="social-buttons">

                    <button
                        type="button"
                        className="social-button"
                        onClick={() =>
                            console.log("Google login")
                        }
                        disabled={loading}
                    >
                        <span className="google-icon">
                            G
                        </span>

                        {t(
                            "auth.login.continueWithGoogle"
                        )}
                    </button>

                    <button
                        type="button"
                        className="social-button"
                        onClick={() =>
                            console.log(
                                "Instagram login"
                            )
                        }
                        disabled={loading}
                    >
                        <FiInstagram className="instagram-icon" />

                        {t(
                            "auth.login.continueWithInstagram"
                        )}
                    </button>
                </div>

                <p className="register-text">
                    {t("auth.login.noAccount")}{" "}

                    <Link to="/register">
                        {t(
                            "auth.login.createAccount"
                        )}
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
