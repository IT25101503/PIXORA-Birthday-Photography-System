package com.pixora.controller;

import com.pixora.dto.AuthRequest;
import com.pixora.dto.AuthResponse;
import com.pixora.dto.RegisterRequest;
import com.pixora.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.pixora.service.OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/photographer-apply")
    public ResponseEntity<AuthResponse> applyPhotographer(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.applyPhotographer(request));
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<java.util.Map<String, Object>> sendOtp(@RequestBody java.util.Map<String, String> body) {
        String phone = body.get("phoneNumber");
        return ResponseEntity.ok(otpService.sendOtp(phone));
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<java.util.Map<String, Object>> verifyOtp(@RequestBody java.util.Map<String, String> body) {
        String phone = body.get("phoneNumber");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");
        return ResponseEntity.ok(otpService.verifyOtpAndResetPassword(phone, otp, newPassword));
    }
}
