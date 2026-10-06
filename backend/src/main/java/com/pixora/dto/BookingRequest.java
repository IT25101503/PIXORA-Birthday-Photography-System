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
    @com.fasterxml.jackson.annotation.JsonAlias({"id"})
    private Long packageId;

    @NotNull @FutureOrPresent
    private LocalDate eventDate;

    @com.fasterxml.jackson.annotation.JsonAlias({"time"})
    private LocalTime eventTime;

    @NotBlank
    @com.fasterxml.jackson.annotation.JsonAlias({"location", "eventLocation", "address"})
    private String venueAddress;

    private String addons;
    private String deliveryTier;
    private java.math.BigDecimal deliveryFeeLkr;
    private java.math.BigDecimal discountAmountLkr;
    private String promoCode;
    @com.fasterxml.jackson.annotation.JsonAlias({"notes", "specialRequests", "instructions"})
    private String clientNotes;
}
