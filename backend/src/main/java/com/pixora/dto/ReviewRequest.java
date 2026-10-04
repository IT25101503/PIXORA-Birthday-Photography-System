package com.pixora.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    @Min(1)
    @Max(5)
    private Integer starRating;

    @NotBlank(message = "Feedback must be between 5 and 100 characters long.")
    @Size(min = 5, max = 100, message = "Feedback must be between 5 and 100 characters long.")
    private String reviewComment;
}