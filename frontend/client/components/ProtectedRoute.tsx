import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: FC = () => {
  const isAuthed = typeof window !== "undefined" && !!localStorage.getItem("initro_auth");
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
