import { useState, useCallback } from "react";
import api from "../services/api";

const useUserDetails = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);
      setSelectedRole(response.data.role?.roleName || "");
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  }, []);

  return {
    user,
    setUser,
    roles,
    selectedRole,
    setSelectedRole,
    loading,
    error,
    fetchUserDetails,
    fetchRoles,
  };
};

export default useUserDetails;
