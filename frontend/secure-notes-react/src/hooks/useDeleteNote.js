import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const useDeleteNote = () => {
  const [deleteLoader, setDeleteLoader] = useState(false);

  const deleteNote = async (noteId) => {
    setDeleteLoader(true);
    try {
      await api.delete(`/notes/${noteId}`);
      toast.success("Note deleted successfully");
      return true;
    } catch (err) {
      toast.error("Delete Note Failed");
      return false;
    } finally {
      setDeleteLoader(false);
    }
  };

  return { deleteNote, deleteLoader };
};

export default useDeleteNote;
