import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || !currentUser.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
