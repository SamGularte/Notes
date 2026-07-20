package com.personal.notes.services;

import com.personal.notes.models.Note;

import java.util.List;

public interface NotesService {

    Note createNoteForUser(String username, String content);

    Note updateNoteForUser(Long noteId, String content, String username);

    void deleteNoteForUser(Long noteId, String userName);

    List<Note> getNotesForUser(String username);
}
