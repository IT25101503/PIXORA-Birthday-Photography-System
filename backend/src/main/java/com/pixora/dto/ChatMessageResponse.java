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
public class ChatMessageResponse {
    private Long messageId;
    private Long bookingId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private Long recipientId;
    private String recipientName;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
