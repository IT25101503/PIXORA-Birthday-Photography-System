package com.pixora.repository;

import com.pixora.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByBookingBookingIdOrderByCreatedAtAsc(Long bookingId);
    long countByRecipientUserIdAndIsReadFalse(Long recipientId);
    void deleteByBookingBookingId(Long bookingId);
    void deleteBySenderUserIdOrRecipientUserId(Long senderId, Long recipientId);
}
