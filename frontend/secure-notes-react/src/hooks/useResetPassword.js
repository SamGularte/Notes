import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (password, token) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newPassword", password);
      await api.post("/auth/public/reset-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("Password reset successful! You can now log in.");
      return true;
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading };
};

export default useResetPassword;
