import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import moment from "moment";

const useAdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit");
      const parsed = response.data.map((item) => ({
        ...item,
        timestampFormatted: moment(item.timestamp).format(
          "MMMM DD, YYYY, hh:mm A"
        ),
      }));
      setAuditLogs(parsed);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return { auditLogs, error, loading };
};

export default useAdminAuditLogs;
