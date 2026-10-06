import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiInstagram } from "react-icons/fi";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

function Register() {
const navigate = useNavigate();
const { register } = useAuth();
const { t, language } = useLanguage();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [acceptedTerms, setAcceptedTerms] = useState(false);

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const passwordRules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !password ||
        !confirmPassword
    ) {
        setError(t("auth.register.fillAllFields"));
        return;
    }

    if (password !== confirmPassword) {
        setError(t("auth.register.passwordsDoNotMatch"));
        return;
    }

    if (
        !passwordRules.minLength ||
        !passwordRules.uppercase ||
        !passwordRules.number ||
        !passwordRules.special
    ) {
        setError(t("auth.register.passwordRequirements"));
        return;
    }

    if (!acceptedTerms) {
        setError(t("auth.register.acceptTerms"));
        return;
    }

    setLoading(true);

    try {
        await register({
            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: confirmPassword,
        });

        navigate("/patient", {
            replace: true,
        });
    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        const validationErrors =
            error.response?.data?.errors;

        if (validationErrors) {
            const firstError = Object.values(
                validationErrors
            )?.[0]?.[0];

            setError(
                firstError ||
                    t("auth.register.registrationFailed")
            );
        } else {
            setError(
                error.response?.data?.message ||
                    t("auth.register.unableToCreate")
            );
        }
    } finally {
        setLoading(false);
    }
};

return (
    <div className="login-page">
        <div className="login-card">
            {/* Header */}

            <div className="login-header">
                <div className="logo">
                    🦷
                </div>

                <h1>{t("auth.register.createAccount")}</h1>

                <p>
                    {t("auth.register.description")}
                </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>
                <Input
                    label={t("auth.register.fullName")}
                    type="text"
                    placeholder={t("auth.register.fullNamePlaceholder")}
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <Input
                    label={t("auth.register.email")}
                    type="email"
                    placeholder={t("auth.register.emailPlaceholder")}
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <Input
                    label={t("auth.register.phone")}
                    type="tel"
                    placeholder={t("auth.register.phonePlaceholder")}
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                />

                <Input
                    label={t("auth.register.password")}
                    type="password"
                    placeholder={t("auth.register.passwordPlaceholder")}
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                {/* Password Rules */}

                <div className="password-rules">
                    <p>
                        {t("auth.register.passwordMustContain")}
                    </p>

                    <div
                        className={
                            passwordRules.minLength
                                ? "rule valid"
                                : "rule"
                        }
                    >
                        {passwordRules.minLength
                            ? "✓"
                            : "✗"}{" "}
                        {t("auth.register.minLength")}
                    </div>

                    <div
                        className={
                            passwordRules.uppercase
                                ? "rule valid"
                                : "rule"
                        }
                    >
                        {passwordRules.uppercase
                            ? "✓"
                            : "✗"}{" "}
                        {t("auth.register.uppercase")}
                    </div>

                    <div
                        className={
                            passwordRules.number
                                ? "rule valid"
                                : "rule"
                        }
                    >
                        {passwordRules.number
                            ? "✓"
                            : "✗"}{" "}
                        {t("auth.register.number")}
                    </div>

                    <div
                        className={
                            passwordRules.special
                                ? "rule valid"
                                : "rule"
                        }
                    >
                        {passwordRules.special
                            ? "✓"
                            : "✗"}{" "}
                        {t("auth.register.special")}
                    </div>
                </div>

                <Input
                    label={t("auth.register.confirmPassword")}
                    type="password"
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                />

                {/* Terms */}

                <div className="terms-container">
                    <label className="terms-label">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) =>
                                setAcceptedTerms(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            {t("auth.register.agreeTo")}{" "}
                            <a
                                href="#"
                                onClick={(e) =>
                                    e.preventDefault()
                                }
                            >
                                {t("auth.register.terms")}
                            </a>
                        </span>
                    </label>
                </div>

                {/* Error */}

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
                        ? t("auth.register.creatingAccount")
                        : t("auth.register.createAccountButton")}
                </Button>
            </form>

            {/* Social */}

            <div className="social-divider">
                <span>
                    {t("auth.register.orContinueWith")}
                </span>
            </div>

            <div className="social-buttons">
                <button
                    type="button"
                    className="social-button"
                    onClick={() =>
                        console.log(
                            "Google signup"
                        )
                    }
                >
                    <span className="google-icon">
                        G
                    </span>

                    {t("auth.register.continueWithGoogle")}
                </button>

                <button
                    type="button"
                    className="social-button"
                    onClick={() =>
                        console.log(
                            "Instagram signup"
                        )
                    }
                >
                    <FiInstagram className="instagram-icon" />

                    {t("auth.register.continueWithInstagram")}
                </button>
            </div>

            {/* Footer */}

            <p className="auth-footer">
                {t("auth.register.alreadyHaveAccount")}{" "}

                <Link to="/login">
                    {t("auth.register.signIn")}
                </Link>
            </p>
        </div>
    </div>
);

}

export default Register;
