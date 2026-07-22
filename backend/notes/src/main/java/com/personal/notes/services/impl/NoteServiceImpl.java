package com.personal.notes.services.impl;

import com.personal.notes.dtos.NoteDTO;
import com.personal.notes.exceptions.BadRequestException;
import com.personal.notes.exceptions.ResourceNotFoundException;
import com.personal.notes.models.Note;
import com.personal.notes.repositories.NoteRepository;
import com.personal.notes.services.AuditLogService;
import com.personal.notes.services.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NotesService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    @Transactional
    public NoteDTO createNoteForUser(String username, String content) {
        Note note = new Note();
        note.setContent(content);
        note.setOwnerUsername(username);
        Note savedNote = noteRepository.save(note);
        auditLogService.logNoteCreation(username, savedNote);
        return convertToDto(savedNote);
    }

    @Override
    @Transactional
    public NoteDTO updateNoteForUser(Long noteId, String content, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));
        if (!note.getOwnerUsername().equals(username)) {
            throw new BadRequestException("Note does not belong to the authenticated user");
        }
        note.setContent(content);
        Note updatedNote = noteRepository.save(note);
        auditLogService.logNoteUpdate(username, updatedNote);
        return convertToDto(updatedNote);
    }

    @Override
    @Transactional
    public void deleteNoteForUser(Long noteId, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));
        if (!note.getOwnerUsername().equals(username)) {
            throw new BadRequestException("Note does not belong to the authenticated user");
        }
        auditLogService.logNoteDeletion(username, noteId);
        noteRepository.delete(note);
    }

    @Override
    @Transactional(readOnly = true)
    public NoteDTO getNoteByIdForUser(Long noteId, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));
        if (!note.getOwnerUsername().equals(username)) {
            throw new BadRequestException("Note does not belong to the authenticated user");
        }
        return convertToDto(note);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteDTO> getNotesForUser(String username) {
        List<Note> personalNotes = noteRepository.findByOwnerUsername(username);
        return personalNotes.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private NoteDTO convertToDto(Note note) {
        return new NoteDTO(note.getId(), note.getContent(), note.getCreatedAt());
    }
}
