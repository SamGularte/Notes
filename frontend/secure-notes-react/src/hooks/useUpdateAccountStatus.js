import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const MESSAGES = {
  lock: "Update Account Lock status Successful",
  expire: "Update Account Expiry status Successful",
  enabled: "Update Account Enabled status Successful",
  credentialsExpire: "Update Account Credentials Expired status Successful",
};

const useUpdateAccountStatus = (userId) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (name, checked, updateUrl) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success(MESSAGES[name]);
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, statusLoader: loading };
};

export default useUpdateAccountStatus;
