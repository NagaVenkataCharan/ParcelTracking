# Database schema

## customers
| Field | Type | Key |
|---|---|---|
| customer_id | INT AUTO_INCREMENT | PK |
| name | VARCHAR(100) | |
| email | VARCHAR(100) | UNIQUE |
| phone | VARCHAR(15) | |
| address | VARCHAR(255) | |

## parcels
| Field | Type | Key |
|---|---|---|
| parcel_id | INT AUTO_INCREMENT | PK |
| customer_id | INT | FK → customers.customer_id |
| sender_address | VARCHAR(255) | |
| receiver_name | VARCHAR(100) | |
| receiver_phone | VARCHAR(15) | |
| receiver_address | VARCHAR(255) | |
| weight | DECIMAL(8,2) | |
| booking_date | DATE | |
| status | VARCHAR(30) | |

## tracking
| Field | Type | Key |
|---|---|---|
| tracking_id | INT AUTO_INCREMENT | PK |
| parcel_id | INT | FK → parcels.parcel_id |
| current_location | VARCHAR(150) | |
| tracking_status | VARCHAR(50) | |
| updated_at | DATETIME | |
| remarks | VARCHAR(255) | |

Relationship: one customer can book many parcels; one parcel can have many tracking events.
