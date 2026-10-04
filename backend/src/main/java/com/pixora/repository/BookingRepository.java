package com.pixora.repository;

import com.pixora.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClientUserId(Long clientId);

    List<Booking> findByPhotographerUserId(Long photographerId);

    @Query("SELECT b FROM Booking b WHERE b.photographer.userId = :photographerId " +
           "AND b.eventDate = :date AND b.status != com.pixora.entity.Booking$BookingStatus.CANCELLED")
    List<Booking> findByPhotographerAndDate(@Param("photographerId") Long photographerId,
                                            @Param("date") LocalDate date);

    @Query("SELECT b.photographer.userId FROM Booking b WHERE b.eventDate = :date " +
           "AND b.status != com.pixora.entity.Booking$BookingStatus.CANCELLED " +
           "AND b.photographer IS NOT NULL")
    List<Long> findBookedPhotographerIdsByDate(@Param("date") LocalDate date);
}