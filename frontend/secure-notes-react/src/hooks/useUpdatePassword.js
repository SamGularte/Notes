import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useUpdatePassword = (userId) => {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (password) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", password);

      await api.put("/admin/update-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("password update success");
      return true;
    } catch (err) {
      toast.error("Error updating password " + err.response.data);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, passwordLoader: loading };
};

export default useUpdatePassword;
