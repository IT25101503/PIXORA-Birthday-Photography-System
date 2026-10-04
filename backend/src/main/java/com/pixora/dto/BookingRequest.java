package com.pixora.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private Long photographerId;

    @NotNull
    private Long packageId;

    @NotNull @FutureOrPresent
    private LocalDate eventDate;

    @NotNull
    private LocalTime eventTime;

    @NotBlank
    private String venueAddress;

    private String addons;
    private String deliveryTier;
    private java.math.BigDecimal deliveryFeeLkr;
    private java.math.BigDecimal discountAmountLkr;
    private String promoCode;
    private String clientNotes;
}
