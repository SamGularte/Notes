package com.personal.notes.services;

import com.personal.notes.dtos.AuditLogDTO;
import com.personal.notes.models.Note;

import java.util.List;

public interface AuditLogService {
    void logNoteCreation(String username, Note note);

    void logNoteUpdate(String username, Note note);
    
    void logNoteDeletion(String username, Long noteId);

    List<AuditLogDTO> getAllAuditLogs();

    List<AuditLogDTO> getAuditLogsForNoteId(Long id);
}
