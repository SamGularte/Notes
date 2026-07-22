import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/auth/public/forgot-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("Password reset email sent! Check your inbox.");
      return true;
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading };
};

export default useForgotPassword;
