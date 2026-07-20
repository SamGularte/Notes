import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useUpdateRole = (userId) => {
  const [loading, setLoading] = useState(false);

  const updateRole = async (roleName) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", roleName);

      await api.put("/admin/update-role", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("Update role successful");
      return true;
    } catch (err) {
      console.log(err);
      toast.error("Update Role Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateRole, updateRoleLoader: loading };
};

export default useUpdateRole;
