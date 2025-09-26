import { useNavigate } from "react-router-dom";
import ButtonConfirm from "../components/ButtonConfirm";

export default function useLogout() {
  const navigate = useNavigate();

  return async function logout() {
    const ok = await ButtonConfirm({
      title: "Sign out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign out",
      cancelText: "Cancel",
    });
    if (!ok) return;

    // 纯粹的会话清理
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/", { replace: true });
  };
}
