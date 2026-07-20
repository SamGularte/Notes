import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/admin/getusers");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error };
};

export default useUsers;
