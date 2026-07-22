package com.personal.notes.controllers;

import com.personal.notes.dtos.NoteDTO;
import com.personal.notes.security.request.NoteRequest;
import com.personal.notes.services.NotesService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    private static final Logger log = LoggerFactory.getLogger(NotesController.class);

    @Autowired
    private NotesService noteService;

    @PostMapping
    public NoteDTO createNote(@Valid @RequestBody NoteRequest request, @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        log.info("Creating note for user: {}", username);
        return noteService.createNoteForUser(username, request.getContent());
    }

    @GetMapping
    public List<NoteDTO> getUserNotes(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        log.debug("Fetching notes for user: {}", username);
        return noteService.getNotesForUser(username);
    }

    @GetMapping("/{noteId}")
    public NoteDTO getNoteById(@PathVariable Long noteId, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        log.debug("Fetching note {} for user: {}", noteId, username);
        return noteService.getNoteByIdForUser(noteId, username);
    }

    @PutMapping("/{noteId}")
    public NoteDTO updateNote(@PathVariable Long noteId, @Valid @RequestBody NoteRequest request, @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        log.info("Updating note {} for user: {}", noteId, username);
        return noteService.updateNoteForUser(noteId, request.getContent(), username);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Long noteId, @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        log.info("Deleting note {} for user: {}", noteId, username);
        noteService.deleteNoteForUser(noteId, username);
    }
}
