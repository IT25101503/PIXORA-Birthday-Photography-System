package com.pixora.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    private Long bookingId;

    @NotNull(message = "Star rating is required")
    @Min(value = 1, message = "Star rating must be at least 1")
    @Max(value = 5, message = "Star rating cannot exceed 5")
    @com.fasterxml.jackson.annotation.JsonAlias({"rating", "stars"})
    private Integer starRating;

    @NotBlank(message = "Feedback must be between 3 and 1000 characters long.")
    @Size(min = 3, max = 1000, message = "Feedback must be between 3 and 1000 characters long.")
    @com.fasterxml.jackson.annotation.JsonAlias({"comment", "feedback"})
    private String reviewComment;
}