package com.pixora.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageDto {
    private Long packageId;
    private String packageName;

    @NotNull(message = "Package price must be a positive value.")
    @Positive(message = "Package price must be a positive value.")
    private BigDecimal priceLkr;

    private String description;
    private Boolean isActive;
}