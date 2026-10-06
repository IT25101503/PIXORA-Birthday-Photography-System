package com.pixora.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

// DTO used to receive review and feedback details from the client
@Data
public class ReviewRequest {
    // Stores the ID of the booking related to the review
    private Long bookingId;


    // Star rating is required and must be between 1 and 5
    @NotNull(message = "Star rating is required")
    @Min(value = 1, message = "Star rating must be at least 1")
    @Max(value = 5, message = "Star rating cannot exceed 5")
    // Allows JSON requests to use either "rating" or "stars"
    @com.fasterxml.jackson.annotation.JsonAlias({"rating", "stars"})
    private Integer starRating;

    // Feedback cannot be empty
    @NotBlank(message = "Feedback must be between 3 and 1000 characters long.")
    // Feedback length must be between 3 and 1000 characters
    @Size(min = 3, max = 1000, message = "Feedback must be between 3 and 1000 characters long.")
    // Allows JSON requests to use either "comment" or "feedback"
    @com.fasterxml.jackson.annotation.JsonAlias({"comment", "feedback"})
    private String reviewComment;
}