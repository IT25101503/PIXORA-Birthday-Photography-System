package com.pixora.controller;

import com.pixora.dto.ChatMessageRequest;
import com.pixora.dto.ChatMessageResponse;
import com.pixora.entity.User;
import com.pixora.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getBookingMessages(bookingId, user.getUserId()));
    }

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable Long bookingId,
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.sendMessage(bookingId, user.getUserId(), request.getMessage()));
    }

    @PutMapping("/booking/{bookingId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User user) {
        chatService.markMessagesAsRead(bookingId, user.getUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("unreadCount", chatService.getUnreadCount(user.getUserId())));
    }
}
