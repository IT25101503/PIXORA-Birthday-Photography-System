package com.pixora.repository;

import com.pixora.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByBookingBookingId(Long bookingId);
    List<Photo> findByIsPublishedPortfolioTrue();
    List<Photo> findByPhotographerUserId(Long photographerId);
}
