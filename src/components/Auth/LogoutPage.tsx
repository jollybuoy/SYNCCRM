import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();                       // clears user + portal + storage
    navigate("/login", { replace: true });  // send to login
  }, [logout, navigate]);

  return null;
}
