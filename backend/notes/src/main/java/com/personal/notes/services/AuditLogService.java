package com.personal.notes.services;

import com.personal.notes.models.AuditLog;
import com.personal.notes.models.Note;

import java.util.List;

public interface AuditLogService {
    void LogNoteCreation(String username, Note note);

    void LogNoteUpdate(String username, Note note);
    
    void LogNoteDeletion(String username, Long noteId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
