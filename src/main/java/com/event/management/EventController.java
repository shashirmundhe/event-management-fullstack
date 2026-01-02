package com.event.management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository repo;

    @GetMapping
    public List<Event> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Event add(@RequestParam("title") String t, @RequestParam("category") String c,
            @RequestParam("description") String d, @RequestParam("file") MultipartFile f) throws IOException {
        return eventService.uploadEvent(t, c, d, f);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}