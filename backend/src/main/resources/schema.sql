-- ============================================================
-- Pixora Database Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN','CLIENT','PHOTOGRAPHER') NOT NULL DEFAULT 'CLIENT',
    portfolio_url VARCHAR(500),
    account_status ENUM('PENDING_APPROVAL','ACTIVE','REJECTED') NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS packages (
    package_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(200) NOT NULL,
    price_lkr DECIMAL(12,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    photographer_id BIGINT,
    package_id BIGINT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue_address VARCHAR(500) NOT NULL,
    total_amount_lkr DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING_ADMIN_APPROVAL','CONFIRMED','PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING_ADMIN_APPROVAL',
    staff_status ENUM('UNSTAFFED','PENDING_ACCEPTANCE','STAFFED','DECLINED') NOT NULL DEFAULT 'UNSTAFFED',
    FOREIGN KEY (client_id) REFERENCES users(user_id),
    FOREIGN KEY (photographer_id) REFERENCES users(user_id),
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    transaction_ref VARCHAR(200) NOT NULL,
    amount_paid_lkr DECIMAL(12,2) NOT NULL,
    payment_status ENUM('PENDING_APPROVAL','APPROVED','REJECTED','PAID') NOT NULL DEFAULT 'PENDING_APPROVAL',
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE IF NOT EXISTS photos (
    photo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    uploaded_by_photographer_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    is_published_portfolio BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (uploaded_by_photographer_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    client_id BIGINT NOT NULL,
    photographer_id BIGINT,
    star_rating INT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    review_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (client_id) REFERENCES users(user_id),
    FOREIGN KEY (photographer_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    reference_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS promo_codes (
    promo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent INT NOT NULL,
    max_discount_lkr DECIMAL(12,2),
    min_booking_amount_lkr DECIMAL(12,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS custom_quotes;

CREATE TABLE IF NOT EXISTS chat_messages (
    message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (recipient_id) REFERENCES users(user_id)
);

