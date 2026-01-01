package com.event.management;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // e.g. "Pink Wedding Decor"
    private String category; // e.g. "Wedding" or "Birthday"
    private String imageUrl; // Link to the photo
    private String description; // Small note about the work
}