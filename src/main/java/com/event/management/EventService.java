package com.event.management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@Service
public class EventService {
    @Autowired
    private EventRepository repo;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public Event uploadEvent(String title, String category, String description, MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath))
            Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Event event = new Event();
        event.setTitle(title);
        event.setCategory(category);
        event.setDescription(description);
        event.setImageUrl("/uploads/" + fileName);
        return repo.save(event);
    }
}