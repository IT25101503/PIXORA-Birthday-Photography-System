package com.pixora.controller;

import com.pixora.dto.BookingResponse;
import com.pixora.dto.NotificationResponse;
import com.pixora.dto.PhotoResponse;
import com.pixora.entity.User;
import com.pixora.service.BookingService;
import com.pixora.service.NotificationService;
import com.pixora.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pixora.dto.ReviewResponse;
import com.pixora.service.ReviewService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/photographer", "/api/photographer"})
@RequiredArgsConstructor
public class PhotographerController {

    private final BookingService bookingService;
    private final PhotoService photoService;
    private final NotificationService notificationService;
    private final ReviewService reviewService;

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getPhotographerBookings(user.getUserId()));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.getReviewsByPhotographer(user.getUserId()));
    }

    @PutMapping("/bookings/{id}/respond")
    public ResponseEntity<BookingResponse> respondToAssignment(@PathVariable Long id,
                                                               @RequestParam String action,
                                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.respondToAssignment(id, user.getUserId(), action));
    }

    @PostMapping("/bookings/{id}/photos")
    public ResponseEntity<PhotoResponse> uploadPhoto(@PathVariable Long id,
                                                     @AuthenticationPrincipal User user,
                                                     @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(photoService.uploadPhoto(id, user.getUserId(), file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/bookings/{id}/photos")
    public ResponseEntity<List<PhotoResponse>> getPhotos(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotosByBooking(id));
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUserId()));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal User user) {
        notificationService.markAllReadForUser(user.getUserId());
        return ResponseEntity.ok().build();
    }
}