package com.pixora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// DTO used to send review and feedback details as a response
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    
    // Unique ID of the review
    private Long reviewId;
    
    // ID of the booking related to the review
    private Long bookingId;
    
    // ID of the client who submitted the review
    private Long clientId;
    
    // Name of the client who submitted the review
    private String clientName;
    
    // ID of the photographer who received the review
    private Long photographerId;
    
    // Name of the photographer who received the review
    private String photographerName;
    
    // Star rating given by the client
    private Integer starRating;
    
    // Feedback/comment written by the client
    private String reviewComment;
    
    // Date and time when the review was created
    private LocalDateTime createdAt;
    
    // Returns reviewId in JSON using the property name "id"
    @com.fasterxml.jackson.annotation.JsonProperty("id")
    public Long getId() { return reviewId; }
    
    // Returns starRating in JSON using the property name "rating"
    @com.fasterxml.jackson.annotation.JsonProperty("rating")
    public Integer getRating() { return starRating; }
    
    // Returns reviewComment in JSON using the property name "comment"
    @com.fasterxml.jackson.annotation.JsonProperty("comment")
    public String getComment() { return reviewComment; }
}