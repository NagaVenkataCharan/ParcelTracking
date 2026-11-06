CREATE DATABASE IF NOT EXISTS courier_tracking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE courier_tracking_db;
CREATE TABLE IF NOT EXISTS customers (
 customer_id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE,
 phone VARCHAR(15) NOT NULL, address VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS parcels (
 parcel_id INT AUTO_INCREMENT PRIMARY KEY,
 customer_id INT NOT NULL, sender_address VARCHAR(255) NOT NULL,
 receiver_name VARCHAR(100) NOT NULL, receiver_phone VARCHAR(15) NOT NULL,
 receiver_address VARCHAR(255) NOT NULL, weight DECIMAL(8,2) NOT NULL,
 booking_date DATE NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'Booked',
 FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
 INDEX idx_parcels_customer(customer_id), INDEX idx_parcels_status(status)
);
CREATE TABLE IF NOT EXISTS tracking (
 tracking_id INT AUTO_INCREMENT PRIMARY KEY, parcel_id INT NOT NULL,
 current_location VARCHAR(150) NOT NULL, tracking_status VARCHAR(50) NOT NULL,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, remarks VARCHAR(255),
 FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id) ON DELETE CASCADE,
 INDEX idx_tracking_parcel_updated(parcel_id, updated_at)
);
