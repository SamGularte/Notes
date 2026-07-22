package com.personal.notes.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class Note {

    @Id
    @GeneratedValue
    private Long id;

    @Lob
    private String content;

    private String ownerUsername;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
