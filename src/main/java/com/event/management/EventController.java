package com.event.management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173") // This allows our React app to talk to this Java app
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // This "door" gives back the list of all events/photos
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // This "door" allows us to add a new event
    @PostMapping
    public Event addEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }
}