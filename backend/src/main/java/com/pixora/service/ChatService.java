package com.pixora.service;

import com.pixora.dto.ChatMessageResponse;
import com.pixora.entity.Booking;
import com.pixora.entity.ChatMessage;
import com.pixora.entity.User;
import com.pixora.repository.BookingRepository;
import com.pixora.repository.ChatMessageRepository;
import com.pixora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ChatMessageResponse sendMessage(Long bookingId, Long senderId, String messageText) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User recipient;
        if (sender.getRole() == User.Role.CLIENT) {
            if (booking.getPhotographer() != null) {
                recipient = booking.getPhotographer();
            } else {
                // If unstaffed, send to admin
                recipient = userRepository.findByEmail("admin@pixora.lk")
                        .orElse(booking.getClient());
            }
        } else if (sender.getRole() == User.Role.PHOTOGRAPHER) {
            recipient = booking.getClient();
        } else {
            // Admin sending: if to client or photographer
            recipient = booking.getClient();
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .booking(booking)
                .sender(sender)
                .recipient(recipient)
                .message(messageText.trim())
                .isRead(false)
                .build();

        ChatMessage saved = chatMessageRepository.save(chatMessage);

        // Send in-app notification to recipient
        notificationService.sendNotification(
                recipient,
                "New message from " + sender.getFullName(),
                messageText.length() > 50 ? messageText.substring(0, 47) + "..." : messageText,
                "CHAT",
                booking.getBookingId()
        );

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getBookingMessages(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findById(userId).orElseThrow();
        boolean isAuthorized = user.getRole() == User.Role.ADMIN ||
                booking.getClient().getUserId().equals(userId) ||
                (booking.getPhotographer() != null && booking.getPhotographer().getUserId().equals(userId));

        if (!isAuthorized) {
            throw new RuntimeException("Unauthorized to view messages for this booking");
        }

        return chatMessageRepository.findByBookingBookingIdOrderByCreatedAtAsc(bookingId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsRead(Long bookingId, Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findByBookingBookingIdOrderByCreatedAtAsc(bookingId);
        for (ChatMessage m : messages) {
            if (m.getRecipient().getUserId().equals(userId) && !m.getIsRead()) {
                m.setIsRead(true);
                chatMessageRepository.save(m);
            }
        }
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return chatMessageRepository.countByRecipientUserIdAndIsReadFalse(userId);
    }

    private ChatMessageResponse toDto(ChatMessage m) {
        return ChatMessageResponse.builder()
                .messageId(m.getMessageId())
                .bookingId(m.getBooking().getBookingId())
                .senderId(m.getSender().getUserId())
                .senderName(m.getSender().getFullName())
                .senderRole(m.getSender().getRole().name())
                .recipientId(m.getRecipient().getUserId())
                .recipientName(m.getRecipient().getFullName())
                .message(m.getMessage())
                .isRead(m.getIsRead())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
