import { Link } from "react-router-dom";

import classes from "./Home.module.css";

const Home = () => {
  return (
    <div className={classes.hero}>
      <div className={classes.content}>
        <h1 className={classes.title}>Welcome</h1>
        <p className={classes.subtitle}>
          Sign in or create an account to continue.
        </p>
        <div className={classes.actions}>
          <Link className={classes.primaryBtn} to="/signup">
            Create account
          </Link>
          <Link className={classes.secondaryBtn} to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
