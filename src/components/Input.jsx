import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useLanguage } from "../context/LanguageContext";

function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const { language } = useLanguage();

  const isPassword = type === "password";

  const inputType = isPassword && showPassword
    ? "text"
    : type;

  return (
    <div className="input-group">

      <label>{label}</label>

      <div className="input-wrapper">

        <input
          className="login-input"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? language === "ar"
                  ? "إخفاء كلمة المرور"
                  : "Hide password"
                : language === "ar"
                  ? "إظهار كلمة المرور"
                  : "Show password"
            }
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}

      </div>

    </div>
  );
}

export default Input;