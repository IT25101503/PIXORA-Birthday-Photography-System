package com.pixora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must contain exactly 10 digits.")
    private String phone;

    private String portfolioUrl;
}