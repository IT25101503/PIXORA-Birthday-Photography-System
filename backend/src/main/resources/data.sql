-- ============================================================
-- Pixora Seed Data
-- ============================================================

-- Master Admin (password: Admin@123 BCrypt encoded)
INSERT IGNORE INTO users (full_name, email, password, role, account_status)
VALUES ('Master Admin', 'admin@pixora.lk', '$2a$10$N.zmdr9k8R.lqZe9f/n./.IflFgkxKpbFTfOcWFe4bZ5AEH4MFAUG', 'ADMIN', 'ACTIVE');

-- Packages in LKR
INSERT IGNORE INTO packages (package_name, price_lkr, description, is_active) VALUES
('Kids Birthday Basic', 10000.00, 'Perfect starter package for intimate kids birthday celebrations. Includes 2-hour coverage, 50 edited digital photos, and private online gallery access.', TRUE),
('Premium Birthday', 15000.00, 'Comprehensive birthday photography with 4-hour coverage, 100 edited digital photos, printed photo album, and private online gallery access.', TRUE),
('Deluxe Birthday', 25000.00, 'Our finest birthday experience with full-day coverage, 200+ edited digital photos, premium leather photo album, large canvas print, and priority 48-hour delivery.', TRUE);
