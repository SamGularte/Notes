import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import moment from "moment";

const useAccountStatus = (currentUser) => {
  const [accountExpired, setAccountExpired] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);
  const [accountEnabled, setAccountEnabled] = useState(false);
  const [credentialExpired, setCredentialExpired] = useState(false);
  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLocked(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);
      setCredentialExpireDate(
        moment(currentUser.credentialsExpiryDate).format("D MMMM YYYY")
      );
    }
  }, [currentUser]);

  const updateStatus = async (endpoint, formKey, value, onSuccess) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append(formKey, value);
      await api.put(endpoint, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      onSuccess(value);
      toast.success("Update successful");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountExpiryStatus = (event) => {
    const value = event.target.checked;
    updateStatus(
      "/auth/update-expiry-status",
      "expire",
      value,
      setAccountExpired
    );
  };

  const handleAccountLockStatus = (event) => {
    const value = event.target.checked;
    updateStatus("/auth/update-lock-status", "lock", value, setAccountLocked);
  };

  const handleAccountEnabledStatus = (event) => {
    const value = event.target.checked;
    updateStatus(
      "/auth/update-enabled-status",
      "enabled",
      value,
      setAccountEnabled
    );
  };

  const handleCredentialExpiredStatus = (event) => {
    const value = event.target.checked;
    updateStatus(
      "/auth/update-credentials-expiry-status",
      "expire",
      value,
      setCredentialExpired
    );
  };

  return {
    accountExpired,
    accountLocked,
    accountEnabled,
    credentialExpired,
    credentialExpireDate,
    loading,
    handleAccountExpiryStatus,
    handleAccountLockStatus,
    handleAccountEnabledStatus,
    handleCredentialExpiredStatus,
  };
};

export default useAccountStatus;
