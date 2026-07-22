import { useState, useCallback, useEffect } from "react";
import api from "../services/api";
import moment from "moment";

const useAuditLogDetails = (noteId) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/audit/note/${noteId}`);
      const parsed = data.map((item) => ({
        ...item,
        timestampFormatted: moment(item.timestamp).format(
          "MMMM DD, YYYY, hh:mm A"
        ),
      }));
      setAuditLogs(parsed);
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (noteId) {
      fetchAuditLogs();
    }
  }, [noteId, fetchAuditLogs]);

  return { auditLogs, loading, error };
};

export default useAuditLogDetails;
