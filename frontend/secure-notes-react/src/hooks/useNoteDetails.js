import { useState, useCallback, useEffect } from "react";
import api from "../services/api";
import moment from "moment";
import { parseContent } from "../utils/parseContent";

const useNoteDetails = (id) => {
  const [note, setNote] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNoteDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/notes/${id}`);
      response.data.parsedContent = parseContent(response.data.content);
      setNote(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid Note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAdminRole = useCallback(async () => {
    try {
      const response = await api.get("/auth/user");
      const roles = response.data.roles;
      setIsAdmin(roles.includes("ROLE_ADMIN"));
    } catch (err) {
      setError("Error checking admin role");
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await api.get(`/audit/note/${id}`);
      const parsed = response.data.map((item) => ({
        ...item,
        timestampFormatted: moment(item.timestamp).format(
          "MMMM DD, YYYY, hh:mm A"
        ),
      }));
      setAuditLogs(parsed);
    } catch (err) {
      setError("Error fetching audit logs");
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNoteDetails();
      checkAdminRole();
    }
  }, [id, fetchNoteDetails, checkAdminRole]);

  useEffect(() => {
    if (isAdmin) {
      fetchAuditLogs();
    }
  }, [isAdmin, fetchAuditLogs]);

  return {
    note,
    setNote,
    auditLogs,
    error,
    isAdmin,
    loading,
    fetchNoteDetails,
  };
};

export default useNoteDetails;
