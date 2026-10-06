import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { useLanguage } from "../../context/LanguageContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError(t("auth.forgotPassword.required"));
      setMessage("");
      return;
    }

    setError("");
    setMessage(t("auth.forgotPassword.success"));
  };

  return (
    <div className="login-page">
<div className="login-card forgot-password-card">
        <div className="login-header">
          <div className="logo">🦷</div>

          <h1>{t("auth.forgotPassword.title")}</h1>

          <p>
            {t("auth.forgotPassword.description")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <Input
            label={t("auth.forgotPassword.email")}
            type="email"
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          {message && (
            <p className="success-text">
              {message}
            </p>
          )}

          <Button type="submit">
            {t("auth.forgotPassword.sendResetLink")}
          </Button>

        </form>

        <p className="auth-footer">
          {t("auth.forgotPassword.rememberPassword")}{" "}
          <Link to="/login">
            {t("auth.forgotPassword.signIn")}
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;