package com.pixora.service;

import com.pixora.dto.NotificationResponse;
import com.pixora.entity.Notification;
import com.pixora.entity.User;
import com.pixora.repository.NotificationRepository;
import com.pixora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendNotification(User user, String title, String message, String type, Long relatedBookingId) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedBookingId(relatedBookingId)
                .isRead(false)
                .build();
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllReadForUser(Long userId) {
        notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId).forEach(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    private NotificationResponse toDto(Notification n) {
        return NotificationResponse.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser().getUserId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .relatedBookingId(n.getRelatedBookingId())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}