package com.personal.notes.services;

import com.personal.notes.dtos.NoteDTO;

import java.util.List;

public interface NotesService {

    NoteDTO createNoteForUser(String username, String content);

    NoteDTO updateNoteForUser(Long noteId, String content, String username);

    void deleteNoteForUser(Long noteId, String userName);

    List<NoteDTO> getNotesForUser(String username);

    NoteDTO getNoteByIdForUser(Long noteId, String username);
}
