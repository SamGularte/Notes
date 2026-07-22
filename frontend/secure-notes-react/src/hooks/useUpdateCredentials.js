import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useUpdateCredentials = (currentUsername) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateCredential = async (data) => {
    const { password: newPassword } = data;
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("newUsername", currentUsername);
      formData.append("newPassword", newPassword);
      await api.put("/auth/update-credentials", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("Update Credential successful");
      return true;
    } catch (error) {
      toast.error("Update Credential failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateCredential, loading };
};

export default useUpdateCredentials;
