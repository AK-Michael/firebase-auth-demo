import { useState } from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import classes from "./GoogleAuthBtn.module.css";

const GoogleAuthBtn = ({ mode }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const signInWithGoogleHandler = async () => {
    const provider = new GoogleAuthProvider();
    setErrorMessage("");

    try {
      await signInWithPopup(auth, provider);
      navigate("/main");
    } catch (error) {
      setErrorMessage(`Google sign-in failed: ${error.message}`);
    }
  };

  const buttonText =
    mode === "signup" ? "Sign up with Google" : "Sign in with Google";

  return (
    <div className={classes.wrapper}>
      <button
        type="button"
        className={classes.Btn}
        onClick={signInWithGoogleHandler}
      >
        <img src="/googleIcon.svg" alt="Google icon" className={classes.icon} />
        <span>{buttonText}</span>
      </button>
      {errorMessage && (
        <p className={classes.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};

export default GoogleAuthBtn;
