package com.pixora.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long bookingId;
    private Long clientId;
    private String clientName;
    private Long photographerId;
    private String photographerName;
    private Long packageId;
    private String packageName;
    private BigDecimal priceLkr;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venueAddress;
    private BigDecimal totalAmountLkr;
    private String status;
    private String staffStatus;
    private String paymentStatus;
    private String addons;
    private String deliveryTier;
    private BigDecimal deliveryFeeLkr;
    private BigDecimal discountAmountLkr;
    private String promoCode;
    private String clientNotes;
}