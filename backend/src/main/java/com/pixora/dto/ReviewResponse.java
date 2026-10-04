package com.pixora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private Long bookingId;
    private Long clientId;
    private String clientName;
    private Long photographerId;
    private String photographerName;
    private Integer starRating;
    private String reviewComment;
    private LocalDateTime createdAt;
}