import classes from "./ErrorMessage.module.css";

const ErrorMessage = ({ condition, message }) =>
  condition ? <p className={classes["error-text"]}>{message}</p> : null;

export default ErrorMessage;
