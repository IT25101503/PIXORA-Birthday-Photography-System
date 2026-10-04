package com.pixora.service;

import com.pixora.dto.ReviewRequest;
import com.pixora.dto.ReviewResponse;
import com.pixora.entity.Booking;
import com.pixora.entity.Review;
import com.pixora.exception.ResourceNotFoundException;
import com.pixora.repository.BookingRepository;
import com.pixora.repository.ReviewRepository;
import com.pixora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(Long bookingId, Long clientId, ReviewRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Reviews can only be submitted for completed bookings");
        }
        if (!booking.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("You can only review your own bookings");
        }
        if (booking.getPhotographer() == null) {
            throw new RuntimeException("This booking has no assigned photographer");
        }
        if (reviewRepository.findByBookingBookingId(bookingId).isPresent()) {
            throw new RuntimeException("Review already submitted for this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .client(booking.getClient())
                .photographer(booking.getPhotographer())
                .starRating(request.getStarRating())
                .reviewComment(request.getReviewComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);
        booking.setReview(saved);
        bookingRepository.save(booking);

        return toResponse(saved);
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long clientId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        if (!review.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("You can only edit your own reviews");
        }
        review.setStarRating(request.getStarRating());
        review.setReviewComment(request.getReviewComment());
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReviewByClient(Long reviewId, Long clientId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        if (!review.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        Booking booking = review.getBooking();
        if (booking != null) {
            booking.setReview(null);
            bookingRepository.save(booking);
        }
        reviewRepository.delete(review);
        reviewRepository.flush();
    }

    @Transactional
    public void deleteReviewByAdmin(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        Booking booking = review.getBooking();
        if (booking != null) {
            booking.setReview(null);
            bookingRepository.save(booking);
        }
        reviewRepository.delete(review);
        reviewRepository.flush();
    }

    @Transactional(readOnly = true)
    public Optional<ReviewResponse> getReviewByBooking(Long bookingId) {
        return reviewRepository.findByBookingBookingId(bookingId).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByPhotographer(Long photographerId) {
        return reviewRepository.findByPhotographerUserId(photographerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .reviewId(r.getReviewId())
                .bookingId(r.getBooking().getBookingId())
                .clientId(r.getClient().getUserId())
                .clientName(r.getClient().getFullName())
                .photographerId(r.getPhotographer().getUserId())
                .photographerName(r.getPhotographer().getFullName())
                .starRating(r.getStarRating())
                .reviewComment(r.getReviewComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}