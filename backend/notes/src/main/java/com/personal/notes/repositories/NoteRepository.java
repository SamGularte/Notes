package com.personal.notes.repositories;

import com.personal.notes.models.Note;
import org.hibernate.sql.results.NoMoreOutputsException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwnerUsername(String ownerUserName);
}
