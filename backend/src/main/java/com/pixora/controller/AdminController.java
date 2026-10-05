package com.pixora.controller;

import com.pixora.dto.*;
import com.pixora.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/admin", "/api/admin"})
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final PhotoService photoService;
    private final PackageService packageService;
    private final ReviewService reviewService;
    private final NotificationService notificationService;

    // ── Users ────────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/clients")
    public ResponseEntity<List<UserDto>> getAllClients() {
        return ResponseEntity.ok(userService.getClients());
    }

    @GetMapping("/users/photographers/pending")
    public ResponseEntity<List<UserDto>> getPendingPhotographers() {
        return ResponseEntity.ok(userService.getPendingPhotographers());
    }

    @GetMapping("/users/photographers")
    public ResponseEntity<List<UserDto>> getAllPhotographers() {
        return ResponseEntity.ok(userService.getPhotographers());
    }

    @PutMapping("/users/{id}/approve")
    public ResponseEntity<UserDto> approvePhotographer(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approvePhotographer(id));
    }

    @PutMapping("/users/{id}/reject")
    public ResponseEntity<UserDto> rejectPhotographer(@PathVariable Long id) {
        return ResponseEntity.ok(userService.rejectPhotographer(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── Bookings ─────────────────────────────────────────────────────────────
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id));
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @RequestMapping(value = "/bookings/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long id,
                                                               @RequestBody java.util.Map<String, String> body) {
        String status = body.getOrDefault("status", "").toUpperCase();
        if ("COMPLETED".equals(status)) {
            return ResponseEntity.ok(bookingService.completeBooking(id));
        } else if ("CONFIRMED".equals(status)) {
            return ResponseEntity.ok(bookingService.confirmBooking(id));
        } else if ("CANCELLED".equals(status)) {
            return ResponseEntity.ok(bookingService.cancelBooking(id));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/bookings/{id}/assign-photographer")
    public ResponseEntity<BookingResponse> assignPhotographer(@PathVariable Long id,
                                                              @RequestParam Long photographerId) {
        return ResponseEntity.ok(bookingService.assignPhotographer(id, photographerId));
    }

    @PutMapping("/bookings/{id}/unassign-photographer")
    public ResponseEntity<BookingResponse> unassignPhotographer(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.unassignPhotographer(id));
    }

    @DeleteMapping("/bookings/{id}/assign-photographer")
    public ResponseEntity<BookingResponse> deletePhotographerAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.unassignPhotographer(id));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // ── Payments ─────────────────────────────────────────────────────────────
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PutMapping("/payments/{id}/approve")
    public ResponseEntity<PaymentResponse> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.approvePayment(id));
    }

    @PutMapping("/payments/{id}/reject")
    public ResponseEntity<PaymentResponse> rejectPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.rejectPayment(id));
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    // ── Photos ───────────────────────────────────────────────────────────────
    @GetMapping("/photos")
    public ResponseEntity<List<PhotoResponse>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @PutMapping("/photos/{id}/toggle-publish")
    public ResponseEntity<PhotoResponse> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.togglePublishPortfolio(id));
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }

    // ── Packages ─────────────────────────────────────────────────────────────
    @GetMapping("/packages")
    public ResponseEntity<List<PackageDto>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @PostMapping("/packages")
    public ResponseEntity<PackageDto> createPackage(@Valid @RequestBody PackageDto dto) {
        return ResponseEntity.ok(packageService.createPackage(dto));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<PackageDto> updatePackage(@PathVariable Long id,
                                                     @Valid @RequestBody PackageDto dto) {
        return ResponseEntity.ok(packageService.updatePackage(id, dto));
    }

    @PutMapping("/packages/{id}/toggle")
    public ResponseEntity<PackageDto> togglePackage(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.toggleActive(id));
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }

    // ── Reviews ──────────────────────────────────────────────────────────────
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable Long id,
                                                       @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReviewByAdmin(id, request));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReviewByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    // ── Notifications ─────────────────────────────────────────────────────────
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getAdminNotifications(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.pixora.entity.User user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUserId()));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllRead(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.pixora.entity.User user) {
        notificationService.markAllReadForUser(user.getUserId());
        return ResponseEntity.ok().build();
    }
}