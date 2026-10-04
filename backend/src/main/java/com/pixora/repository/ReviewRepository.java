package com.pixora.repository;

import com.pixora.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBookingBookingId(Long bookingId);
    List<Review> findByPhotographerUserId(Long photographerId);
    List<Review> findByClientUserId(Long clientId);
}
