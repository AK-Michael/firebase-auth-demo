import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import classes from "./MainPage.module.css";

const ASSETS = [
  { src: "/signup-bg.jpg", label: "Registration" },
  { src: "/login-bg.jpg", label: "Sign in" },
  { src: "/ForgotPass-bg.jpg", label: "Password reset" },
  { src: "/home-bg.jpg", label: "Landing" },
];

const MainPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  const logoutHandler = async () => {
    await signOut(auth);
    navigate("/home", { replace: true });
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <div>
          <span className={classes.brand}>Dashboard</span>
          <h1 className={classes.greeting}>Hello, {displayName}</h1>
        </div>
        <button onClick={logoutHandler} className={classes.logoutButton}>
          Sign out
        </button>
      </header>

      <main className={classes.main}>
        <p className={classes.intro}>
          You&apos;re past the protected route. Below are the photographs used
          across the auth screens in this project.
        </p>

        <h2 className={classes.sectionLabel}>Project imagery</h2>

        <div className={classes.imageGrid}>
          {ASSETS.map((asset) => (
            <div
              key={asset.src}
              className={classes.imageItem}
              onClick={() => setSelectedImage(asset)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedImage(asset);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${asset.label} background`}
            >
              <img src={asset.src} alt={asset.label} loading="lazy" />
            </div>
          ))}
        </div>
      </main>

      {selectedImage && (
        <div
          className={classes.modal}
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={classes.closeButton}
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={selectedImage.src} alt={selectedImage.label} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
