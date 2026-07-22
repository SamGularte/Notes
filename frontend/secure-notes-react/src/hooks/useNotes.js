import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import moment from "moment";
import { parseContent } from "../utils/parseContent";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/notes");
      const parsedNotes = response.data.map((note) => ({
        ...note,
        parsedContent: parseContent(note.content),
        createdAtFormatted: moment(note.createdAt).format("D MMMM YYYY"),
      }));
      setNotes(parsedNotes);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, refetch: fetchNotes };
};

export default useNotes;
