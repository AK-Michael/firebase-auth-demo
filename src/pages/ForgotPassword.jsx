import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useInput from "../hooks/use-input";
import InputField from "../UI/InputField";
import ErrorMessage from "../UI/ErrorMessage";

import layout from "../styles/auth-layout.module.css";
import classes from "./ForgotPassword.module.css";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const ForgotPassword = () => {
  const email = useInput(isEmail);

  const [submitted, setSubmitted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formIsValid = email.isValid;
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();

    email.inputBlurHandler();

    if (!formIsValid) return;

    setErrorMessage("");

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email.value);
      setSubmitted(true);
      email.reset();
      setShouldRedirect(true);
    } catch (error) {
      setErrorMessage(
        error.message || "Could not send the reset email. Try again."
      );
    }
  };

  useEffect(() => {
    if (submitted && shouldRedirect) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setShouldRedirect(false);
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted, navigate, shouldRedirect]);

  return (
    <div className={classes.mobileBg}>
      <div className={layout.leftPane}>
        <img
          src="/ForgotPass-bg.jpg"
          alt=""
          className={layout.image}
          loading="lazy"
        />
      </div>

      <div className={layout.rightPane}>
        <div className={layout.formWrap}>
          <Link to="/login" className={layout.homeLink}>
            ← Back to sign in
          </Link>

          <form onSubmit={submitHandler} className={layout.form}>
            <h1 className={layout.formTitle}>Reset password</h1>
            <p className={layout.formLead}>
              Enter your account email and we&apos;ll send you a link to choose
              a new password.
            </p>

            {submitted && (
              <p className={layout.bannerSuccess}>
                Reset link sent. Check your email.
              </p>
            )}
            {errorMessage && (
              <p className={layout.bannerError}>{errorMessage}</p>
            )}

            <div className={layout.formGroup}>
              <InputField
                id="email"
                label="Email"
                type="email"
                value={email.value}
                onChange={email.valueChangeHandler}
                onBlur={email.inputBlurHandler}
                hasError={email.hasError}
                placeholder="you@example.com"
              />
              <ErrorMessage
                condition={email.hasError}
                message="Enter a valid email address"
              />
            </div>

            <div className={layout.buttonContainer}>
              <button type="submit" className={layout.button}>
                Send reset link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
