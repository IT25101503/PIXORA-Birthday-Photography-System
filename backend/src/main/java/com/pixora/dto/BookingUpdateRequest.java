package com.pixora.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingUpdateRequest {

    @NotNull
    @FutureOrPresent
    private LocalDate eventDate;

    @NotNull
    private LocalTime eventTime;

    @NotBlank
    private String venueAddress;

    private String clientNotes;
}
