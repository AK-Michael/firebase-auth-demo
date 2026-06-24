import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useInput from "../hooks/use-input";
import InputField from "../UI/InputField";
import ErrorMessage from "../UI/ErrorMessage";
import GoogleAuthBtn from "../components/GoogleAuthBtn";

import layout from "../styles/auth-layout.module.css";
import classes from "./Signup.module.css";

import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

const isNotEmpty = (value) => value.trim() !== "";
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
const isPassword = (value) => value.trim().length >= 8;

const Signup = () => {
  const firstName = useInput(isNotEmpty);
  const lastName = useInput(isNotEmpty);
  const email = useInput(isEmail);
  const password = useInput(isPassword);

  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const confirmPasswordIsValid =
    confirmPasswordValue === password.value && password.value.length >= 8;
  const confirmPasswordHasError =
    !confirmPasswordIsValid && confirmPasswordTouched;

  const formIsValid =
    firstName.isValid &&
    lastName.isValid &&
    email.isValid &&
    password.isValid &&
    confirmPasswordIsValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    firstName.inputBlurHandler();
    lastName.inputBlurHandler();
    email.inputBlurHandler();
    password.inputBlurHandler();
    setConfirmPasswordTouched(true);

    if (!formIsValid) return;

    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName.value} ${lastName.value}`,
      });

      await sendEmailVerification(user);
      await signOut(auth);

      setSubmitted(true);

      firstName.reset();
      lastName.reset();
      email.reset();
      password.reset();
      setConfirmPasswordValue("");
      setConfirmPasswordTouched(false);

      setShouldRedirect(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (submitted && shouldRedirect) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setShouldRedirect(false);
        navigate("/login", {
          replace: true,
          state: {
            verificationMessage:
              "Account created. Check your email to verify before signing in.",
          },
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submitted, navigate, shouldRedirect]);

  return (
    <div className={classes.mobileBg}>
      <div className={layout.leftPane}>
        <img
          src="/signup-bg.jpg"
          alt=""
          className={layout.image}
          fetchPriority="high"
        />
      </div>

      <div className={layout.rightPane}>
        <div className={layout.formWrap}>
          <Link to="/home" className={layout.homeLink}>
            ← Home
          </Link>

          <form onSubmit={submitHandler} className={layout.form}>
            <h1 className={layout.formTitle}>Create account</h1>
            <p className={layout.formLead}>
              Fill in your details below. We&apos;ll send a verification link to
              your email.
            </p>

            {submitted && (
              <p className={layout.bannerSuccess}>
                Account created. Check your inbox for the verification email.
              </p>
            )}
            {errorMessage && (
              <p className={layout.bannerError}>{errorMessage}</p>
            )}

            <div className={layout.formGroup}>
              <div className={classes.nameRow}>
                <div>
                  <InputField
                    id="firstName"
                    label="First name"
                    value={firstName.value}
                    onChange={firstName.valueChangeHandler}
                    onBlur={firstName.inputBlurHandler}
                    hasError={firstName.hasError}
                    placeholder="Jane"
                  />
                  <ErrorMessage
                    condition={firstName.hasError}
                    message="Required"
                  />
                </div>

                <div>
                  <InputField
                    id="lastName"
                    label="Last name"
                    value={lastName.value}
                    onChange={lastName.valueChangeHandler}
                    onBlur={lastName.inputBlurHandler}
                    hasError={lastName.hasError}
                    placeholder="Smith"
                  />
                  <ErrorMessage
                    condition={lastName.hasError}
                    message="Required"
                  />
                </div>
              </div>

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

              <InputField
                id="password"
                label="Password"
                type="password"
                value={password.value}
                onChange={password.valueChangeHandler}
                onBlur={password.inputBlurHandler}
                hasError={password.hasError}
                placeholder="At least 8 characters"
              />
              <ErrorMessage
                condition={password.hasError}
                message="Use at least 8 characters"
              />

              <InputField
                id="confirmPassword"
                label="Confirm password"
                type="password"
                value={confirmPasswordValue}
                onChange={(e) => setConfirmPasswordValue(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                hasError={confirmPasswordHasError}
                placeholder="Repeat your password"
              />
              <ErrorMessage
                condition={confirmPasswordHasError}
                message="Passwords must match"
              />
            </div>

            <div className={layout.buttonContainer}>
              <button type="submit" className={layout.button}>
                Create account
              </button>
            </div>

            <div className={layout.divider}>or</div>

            <div className={layout.googleSection}>
              <GoogleAuthBtn mode="signup" />
            </div>

            <p className={layout.footer}>
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
