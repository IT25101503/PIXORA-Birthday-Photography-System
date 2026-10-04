package com.pixora.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private Long userId;
    private String title;
    private String message;
    private String type;
    private Long relatedBookingId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}