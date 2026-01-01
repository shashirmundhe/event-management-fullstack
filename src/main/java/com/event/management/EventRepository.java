package com.event.management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // This interface will now have methods like save(), findAll(), and delete()
    // without us writing any more code!
}