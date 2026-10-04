package com.pixora.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "photographer_id")
    private User photographer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "package_id", nullable = false)
    private Package pkg;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time", nullable = false)
    private LocalTime eventTime;

    @Column(name = "venue_address", nullable = false, length = 500)
    private String venueAddress;

    @Column(name = "total_amount_lkr", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmountLkr;

    @Column(name = "addons", length = 500)
    private String addons;

    @Column(name = "delivery_tier", length = 50)
    @Builder.Default
    private String deliveryTier = "STANDARD";

    @Column(name = "delivery_fee_lkr", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal deliveryFeeLkr = BigDecimal.ZERO;

    @Column(name = "discount_amount_lkr", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmountLkr = BigDecimal.ZERO;

    @Column(name = "promo_code", length = 50)
    private String promoCode;

    @Column(name = "client_notes", length = 1000)
    private String clientNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "staff_status", nullable = false)
    @Builder.Default
    private StaffStatus staffStatus = StaffStatus.UNSTAFFED;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private List<Photo> photos;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Review review;

    public enum BookingStatus {
        PENDING_ADMIN_APPROVAL, CONFIRMED, PAID, CANCELLED, COMPLETED
    }

    public enum StaffStatus {
        UNSTAFFED, PENDING_ACCEPTANCE, STAFFED, DECLINED
    }
}