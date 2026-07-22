import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useCreateNote = () => {
  const [loading, setLoading] = useState(false);

  const createNote = async (content) => {
    if (content.trim().length === 0) {
      toast.error("Note content is required");
      return false;
    }
    setLoading(true);
    try {
      const noteData = { content };
      await api.post("/notes", noteData);
      toast.success("Note created successfully");
      return true;
    } catch (err) {
      toast.error("Error creating note");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading };
};

export default useCreateNote;
