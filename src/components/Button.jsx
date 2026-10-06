function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="login-button"
    >
      {children}
    </button>
  );
}

export default Button;