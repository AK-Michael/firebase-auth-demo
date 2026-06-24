import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useInput from "../hooks/use-input";
import InputField from "../UI/InputField";
import ErrorMessage from "../UI/ErrorMessage";
import GoogleAuthBtn from "../components/GoogleAuthBtn";

import layout from "../styles/auth-layout.module.css";
import classes from "./Login.module.css";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const isNotEmpty = (value) => value.trim() !== "";
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const Login = () => {
  const email = useInput(isEmail);
  const password = useInput(isNotEmpty);

  const [submitted, setSubmitted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const formIsValid = email.isValid && password.isValid;

  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.verificationMessage) {
      setInfoMessage(location.state.verificationMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const submitHandler = async (event) => {
    event.preventDefault();

    email.inputBlurHandler();
    password.inputBlurHandler();

    if (!formIsValid) return;

    setErrorMessage("");
    setInfoMessage("");
    setIsNotVerified(false);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setIsNotVerified(true);
        password.reset();
        return;
      }

      setSubmitted(true);
      setIsLoading(true);
      email.reset();
      password.reset();
      setShouldRedirect(true);
    } catch {
      setErrorMessage("Invalid email or password.");
    }
  };

  useEffect(() => {
    if (submitted && shouldRedirect) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setShouldRedirect(false);
        setIsLoading(false);
        navigate("/main", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submitted, navigate, shouldRedirect]);

  return (
    <div className={classes.mobileBg}>
      <div className={layout.leftPane}>
        <img
          src="/login-bg.jpg"
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
            <h1 className={layout.formTitle}>Sign in</h1>
            <p className={layout.formLead}>
              Use the email and password from your account.
            </p>

            {submitted && (
              <p className={layout.bannerSuccess}>Signed in successfully.</p>
            )}
            {infoMessage && (
              <p className={layout.bannerInfo}>{infoMessage}</p>
            )}
            {errorMessage && (
              <p className={layout.bannerError}>{errorMessage}</p>
            )}
            {isNotVerified && (
              <p className={layout.bannerError}>
                Your email isn&apos;t verified yet. Check your inbox, then try
                again.
              </p>
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
                message="Enter the email you registered with"
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                value={password.value}
                onChange={password.valueChangeHandler}
                onBlur={password.inputBlurHandler}
                hasError={password.hasError}
                placeholder="Your password"
              />
              <ErrorMessage
                condition={password.hasError}
                message="Password is required"
              />
            </div>

            <div className={layout.buttonContainer}>
              <button
                type="submit"
                className={layout.button}
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </div>

            <div className={layout.divider}>or</div>

            <div className={layout.googleSection}>
              <GoogleAuthBtn mode="login" />
            </div>

            <p className={layout.footer}>
              Need an account? <Link to="/signup">Register</Link>
            </p>

            <div className={layout.footerLinks}>
              <Link to="/forgotPass">Forgot your password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
