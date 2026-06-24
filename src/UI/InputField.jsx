import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import classes from "./InputField.module.css";

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  hasError,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const wrapperClass = hasError
    ? `${classes.wrapper} ${classes.invalid}`
    : classes.wrapper;

  const fieldClass = isPasswordField
    ? `${classes.field} ${classes.fieldWithIcon}`
    : classes.field;

  return (
    <div className={wrapperClass}>
      <label className={classes.label} htmlFor={id}>
        {label}
      </label>

      <div className={classes.inputWrapper}>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={fieldClass}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={classes.iconBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
